import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const url = new URL(req.url)
    const lat = url.searchParams.get('latitude') || '19.0760' // Mumbai default
    const lon = url.searchParams.get('longitude') || '72.8777'

    console.log(`[WEATHER] Fetching for Lat:${lat}, Lon:${lon}`)

    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&hourly=temperature_2m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
    
    const res = await fetch(openMeteoUrl)
    if (!res.ok) throw new Error(`Open-Meteo error: ${res.statusText}`)
    
    const data = await res.json()
    
    // Structure it like the frontend expects: { weather: data }
    return new Response(JSON.stringify({
      success: true,
      weather: data,
      // Add compatibility fields if needed
      current: data.current,
      daily: data.daily
    }), {
      headers: { ...cors, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: (error as Error).message }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' }
    })
  }
})
