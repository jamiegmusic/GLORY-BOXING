import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface PortraitRequest {
  fighterStats: FighterData
  fighterId: string
}

interface FighterData {
  ethnicity: string
  age: number
  physique: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { fighterStats, fighterId }: PortraitRequest = await req.json()

    if (!fighterStats || !fighterId) {
      throw new Error('Fighter stats and ID are required')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate portrait using Replicate API
    const replicateResponse = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${Deno.env.get('REPLICATE_API_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'stability-ai/stable-diffusion:db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf',
        input: {
          prompt: `Professional boxing headshot, ${fighterStats.ethnicity}, ${fighterStats.age} years old, ${fighterStats.physique}`
        }
      }),
    })

    if (!replicateResponse.ok) {
      throw new Error(`Replicate API error: ${replicateResponse.statusText}`)
    }

    const replicateResult = await replicateResponse.json()

    // Download image
    const imageUrl = replicateResult.output[0]

    const imageResponse = await fetch(imageUrl)
    const imageBuffer = await imageResponse.arrayBuffer()
    const imageArray = new Uint8Array(imageBuffer)

    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `portraits/${fighterId}_${timestamp}.png`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('game-assets')
      .upload(filename, imageArray, {
        contentType: 'image/png',
        cacheControl: '3600'
      })

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('game-assets')
      .getPublicUrl(filename)

    // Store portrait record in database
    const { data: portraitRecord, error: dbError } = await supabase
      .from('fighter_portraits')
      .insert({
        fighter_id: fighterId,
        portrait_url: urlData.publicUrl,
        file_path: filename
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Don't throw here, as the image file was created successfully
    }

    return new Response(
      JSON.stringify({
        success: true,
        portrait_url: urlData.publicUrl,
        portrait_record: portraitRecord,
        message: 'Portrait generated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Portrait generation error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

