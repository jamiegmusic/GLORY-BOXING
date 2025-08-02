import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CommentaryRequest {
  matchId: string
  matchResult: MatchResult
  commentaryStyle: 'professional' | 'hype' | 'technical' | 'dramatic'
}

interface MatchResult {
  winner: string
  loser: string
  method: string
  round: number
  time: string
  keyMoments: string[]
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { matchId, matchResult, commentaryStyle }: CommentaryRequest = await req.json()

    if (!matchId || !matchResult) {
      throw new Error('Match ID and result are required')
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Generate commentary text using OpenAI
    const commentaryPrompt = `
      Generate boxing match commentary in a ${commentaryStyle} style for this fight result:
      
      Winner: ${matchResult.winner}
      Loser: ${matchResult.loser}
      Method: ${matchResult.method}
      Round: ${matchResult.round}
      Time: ${matchResult.time}
      Key Moments: ${matchResult.keyMoments.join(', ')}
      
      Create a 30-60 second commentary summary that captures the excitement and key moments of the fight.
    `

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are a professional boxing commentator. Generate exciting, accurate commentary for boxing matches.'
          },
          {
            role: 'user',
            content: commentaryPrompt
          }
        ],
        max_tokens: 200,
        temperature: 0.8
      }),
    })

    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.statusText}`)
    }

    const openaiResult = await openaiResponse.json()
    const commentaryText = openaiResult.choices[0].message.content

    // Voice style mapping
    const voiceMapping = {
      professional: 'nova',
      hype: 'fable',
      technical: 'echo',
      dramatic: 'onyx'
    }

    // Generate voice for commentary
    const voiceResponse = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: voiceMapping[commentaryStyle] || 'nova',
        input: commentaryText,
        response_format: 'mp3'
      }),
    })

    if (!voiceResponse.ok) {
      throw new Error(`Voice generation error: ${voiceResponse.statusText}`)
    }

    const audioBuffer = await voiceResponse.arrayBuffer()
    const audioArray = new Uint8Array(audioBuffer)

    // Generate unique filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `commentary/${matchId}_${timestamp}.mp3`

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

    // Store commentary record in database
    const { data: commentaryRecord, error: dbError } = await supabase
      .from('match_commentary')
      .insert({
        match_id: matchId,
        commentary_text: commentaryText,
        audio_url: urlData.publicUrl,
        commentary_style: commentaryStyle,
        file_path: filename
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Don't throw here, as the audio file was created successfully
    }

    // Update match record with commentary
    await supabase
      .from('matches')
      .update({
        commentary_url: urlData.publicUrl,
        commentary_text: commentaryText
      })
      .eq('id', matchId)

    return new Response(
      JSON.stringify({
        success: true,
        commentary_text: commentaryText,
        audio_url: urlData.publicUrl,
        commentary_record: commentaryRecord,
        message: 'Commentary generated successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Commentary generation error:', error)
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
