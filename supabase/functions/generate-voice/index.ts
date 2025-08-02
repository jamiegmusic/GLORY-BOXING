import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface VoiceRequest {
  text: string
  fighterPersonality: 'aggressive' | 'calm' | 'cocky' | 'humble' | 'intimidating'
  voiceType: 'commentary' | 'taunt' | 'interview' | 'press_conference'
  fighterId?: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { text, fighterPersonality, voiceType, fighterId }: VoiceRequest = await req.json()

    if (!text) {
      throw new Error('Text is required')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Voice personality mapping
    const voiceMapping = {
      aggressive: 'onyx',
      calm: 'nova',
      cocky: 'fable',
      humble: 'echo',
      intimidating: 'onyx'
    }

    // Generate voice using OpenAI TTS
    const openaiResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: voiceMapping[fighterPersonality] || 'nova',
        input: text,
        response_format: 'mp3'
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const audioBuffer = await openaiResponse.arrayBuffer()
    const audioArray = new Uint8Array(audioBuffer)

    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `voice/${voiceType}/${fighterId || 'system'}_${timestamp}.mp3`

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('game-assets')
      .upload(filename, audioArray, {
        contentType: 'audio/mpeg',
        cacheControl: '3600'
      })

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`)
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('game-assets')
      .getPublicUrl(filename)

    // Store voice record in database
    const { data: voiceRecord, error: dbError } = await supabase
      .from('voice_clips')
      .insert({
        fighter_id: fighterId,
        text_content: text,
        audio_url: urlData.publicUrl,
        voice_type: voiceType,
        personality: fighterPersonality,
        file_path: filename
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Don't throw here, as the audio file was created successfully
    }

    return new Response(
      JSON.stringify({
        success: true,
        audio_url: urlData.publicUrl,
        voice_record: voiceRecord,
        message: 'Voice generated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Voice generation error:', error)
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
