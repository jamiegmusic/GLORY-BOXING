import { NextRequest, NextResponse } from 'next/server'

interface CommentaryRequest {
  fightData: {
    fighter1: any
    fighter2: any
    fight: any
    style: 'technical' | 'dramatic' | 'casual'
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: CommentaryRequest = await request.json()
    const { fighter1, fighter2, fight, style } = body.fightData

    // Generate commentary based on style
    const commentary = generateCommentary(fighter1, fighter2, fight, style)

    return NextResponse.json({
      commentary,
      style,
      fightId: fight.id,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error generating commentary:', error)
    return NextResponse.json(
      { error: 'Failed to generate commentary' },
      { status: 500 }
    )
  }
}

function generateCommentary(fighter1: any, fighter2: any, fight: any, style: string): string[] {
  const commentary: string[] = []

  // Fight intro
  if (style === 'dramatic') {
    commentary.push(`🔥 Welcome to ${fight.event_name}! The crowd is electric as we prepare for an epic showdown!`)
    commentary.push(`${fighter1.name} vs ${fighter2.name} - this is going to be a war!`)
  } else if (style === 'technical') {
    commentary.push(`Welcome to ${fight.event_name}. We have a ${fight.weight_class} bout scheduled for ${fight.rounds_scheduled} rounds.`)
    commentary.push(`${fighter1.name} enters with a record of ${fighter1.record_wins}-${fighter1.record_losses}-${fighter1.record_draws}.`)
  } else {
    commentary.push(`Hey everyone, welcome to ${fight.event_name}!`)
    commentary.push(`We've got ${fighter1.name} taking on ${fighter2.name} tonight.`)
  }

  // Fighter analysis
  if (style === 'technical') {
    commentary.push(`${fighter1.name} shows excellent ${fighter1.fighting_style} with a ${fighter1.punching_power}/100 power rating.`)
    commentary.push(`${fighter2.name} counters with ${fighter2.fighting_style} and a ${fighter2.speed}/100 speed rating.`)
  } else if (style === 'dramatic') {
    commentary.push(`${fighter1.name} is a BEAST in the ring! Look at that power!`)
    commentary.push(`${fighter2.name} is lightning fast! This is going to be explosive!`)
  } else {
    commentary.push(`${fighter1.name} looks ready to go tonight.`)
    commentary.push(`${fighter2.name} seems confident too. This should be good!`)
  }

  // Round-by-round commentary
  for (let round = 1; round <= Math.min(3, fight.rounds_scheduled); round++) {
    if (style === 'dramatic') {
      commentary.push(`ROUND ${round} - THE ACTION IS HEATING UP!`)
      commentary.push(`${fighter1.name} lands a HUGE shot! The crowd goes wild!`)
      commentary.push(`${fighter2.name} fires back! This is incredible action!`)
    } else if (style === 'technical') {
      commentary.push(`Round ${round} begins. Both fighters showing good technique.`)
      commentary.push(`${fighter1.name} working the jab effectively.`)
      commentary.push(`${fighter2.name} countering well with the right hand.`)
    } else {
      commentary.push(`Round ${round} is underway.`)
      commentary.push(`${fighter1.name} getting some good shots in.`)
      commentary.push(`${fighter2.name} answering back.`)
    }
  }

  // Fight conclusion
  if (style === 'dramatic') {
    commentary.push(`WHAT A FIGHT! The crowd is on their feet!`)
    commentary.push(`This is why we love boxing! Incredible action from start to finish!`)
  } else if (style === 'technical') {
    commentary.push(`The final bell sounds. Both fighters showed excellent skill.`)
    commentary.push(`The judges will have a difficult decision to make.`)
  } else {
    commentary.push(`That was a good fight!`)
    commentary.push(`Both fighters gave it their all.`)
  }

  return commentary
} 