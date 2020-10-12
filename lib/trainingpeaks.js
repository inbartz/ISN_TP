var request = require('request-promise')

var _authData = null

const TP_TOKEN_URL = 'https://oauth.trainingpeaks.com/oauth/token'
const TP_API_URL = 'https://api.trainingpeaks.com/'
const TP_CLIENT_ID = 'israelcyclingacademy'
const TP_CLIENT_SECRET = 'TIwlq9PXCIXxI73uvIU3IIHwhHlehGCSosJQQNqJRc'
const TP_SCOPES = 'metrics:read workouts:read coach:athletes'
const TP_GRANT_TYPE = 'password'
const TP_USERNAME = 'PauloSaldanha'
const TP_PASSWORD = 'azoresp1s1'

exports.login = async () => {
  var options = {
    method: 'POST',
    form: {
      client_id: TP_CLIENT_ID,
      client_secret: TP_CLIENT_SECRET,
      grant_type: TP_GRANT_TYPE,
      scope: TP_SCOPES,
      username: TP_USERNAME,
      password: TP_PASSWORD
    },
    headers: {
      /* 'content-type': 'application/x-www-form-urlencoded' */
      // Is set automatically
    }
  }

  try {
    const response = await request(TP_TOKEN_URL, options)
    _authData = JSON.parse(response)
    return _authData
  } catch (error) {
    throw new Error(`Error logging in\n${error.error}`)
  }
}

exports.getAthletes = async () => {
  var options = {
    method: 'GET',
    uri: `${TP_API_URL}/v1/coach/athletes`,
    auth: {
      bearer: _authData.access_token
    },
    headers: {
      'User-Agent': TP_CLIENT_ID
    }
  }

  try {
    const response = await request(options)
    return JSON.parse(response)
  } catch (error) {
    throw new Error(`Error getting athletes\n${error.error}`)
  }
}

exports.getWorkouts = async (athlete, startDate, endDate) => {
  var options = {
    method: 'GET',
    uri: `${TP_API_URL}/v1/workouts/${athlete.Id}/${startDate}/${endDate}`,
    auth: {
      bearer: _authData.access_token
    },
    headers: {
      'User-Agent': TP_CLIENT_ID
    }
  }

  try {
    const response = await request(options)
    return JSON.parse(response)
  } catch (error) {
    throw new Error(
      `Error getting workouts for ${athlete.FirstName} ${athlete.LastName}\n${error.error}`
    )
  }
}

exports.getWorkoutMeanMaxes = async (athlete, workout) => {
  var options = {
    method: 'GET',
    uri: `${TP_API_URL}/v1/workouts/${athlete.Id}/id/${workout.Id}/meanmaxes`,
    auth: {
      bearer: _authData.access_token
    },
    headers: {
      'User-Agent': TP_CLIENT_ID
    }
  }

  try {
    const response = await request(options)
    const workoutMeanMaxes = JSON.parse(response)

    /* Object being returned */
    var meanMaxes = {}
    if (workoutMeanMaxes !== null) {
      pushMeanMaxes(meanMaxes, workoutMeanMaxes.MeanMaxPowers, 'Power')
      pushMeanMaxes(meanMaxes, workoutMeanMaxes.MeanMaxHeartRates, 'HR')
      pushMeanMaxes(meanMaxes, workoutMeanMaxes.MeanMaxCadences, 'Cadence')
      pushMeanMaxes(meanMaxes, workoutMeanMaxes.MeanMaxSpeeds, 'Speed')
      pushMeanMaxes(meanMaxes, workoutMeanMaxes.MeanMaxSpeedsByDistance, 'Distance')
    }

    return meanMaxes
  } catch (error) {
    /* Ignore 403 Errors */
    if (is403Error(error)) {
      console.log(`${athlete.FirstName} ${athlete.LastName} is not premium`)
    } else {
      console.log(
        `Error getting Mean Maxes for ${athlete.FirstName} ${athlete.LastName}\n${error.message}`
      )
    }
  }
}

exports.getWorkoutTimeInZones = async (athlete, workout) => {
  var options = {
    method: 'GET',
    uri: `${TP_API_URL}/v1/workouts/${athlete.Id}/id/${workout.Id}/timeinzones`,
    auth: {
      bearer: _authData.access_token
    },
    headers: {
      'User-Agent': TP_CLIENT_ID
    }
  }

  try {
    const response = await request(options)
    const zones = JSON.parse(response)

    /* Object being returned */
    var timeInZones = {}

    if (zones !== null) {
      pushTimeInZones(timeInZones, zones.TimeInPowerZones, 'Power')
      pushTimeInZones(timeInZones, zones.TimeInSpeedZones, 'Speed')
      pushTimeInZones(timeInZones, zones.TimeInHeartRateZones, 'HR')
    }

    return timeInZones
  } catch (error) {
    /* Ignore 403 Errors */
    if (is403Error(error)) {
      console.log(`${athlete.FirstName} ${athlete.LastName} is not premium`)
    } else {
      console.log(
        `Error getting Time In Zones for ${athlete.FirstName} ${athlete.LastName}\n${error.message}`
      )
    }
  }
}

exports.getAthleteMetrics = async (athlete, startDate, endDate) => {
  var options = {
    method: 'GET',
    uri: `${TP_API_URL}/v1/metrics/${athlete.Id}/${startDate}/${endDate}`,
    auth: {
      bearer: _authData.access_token
    },
    headers: {
      'User-Agent': TP_CLIENT_ID
    }
  }

  try {
    const response = await request(options)
    const metrics = JSON.parse(response)

    return metrics
  } catch (error) {
    /* Ignore 403 Errors */
    if (is403Error(error)) {
      console.log(`${athlete.FirstName} ${athlete.LastName} is not premium`)
    } else {
      console.log(
        `Error getting Metrics for ${athlete.FirstName} ${athlete.LastName}\n${error.message}`
      )
    }
  }
}

const pushMeanMaxes = (meanMaxes, metric, label) => {
  if (metric !== null) {
    const mm = metric.MeanMaxes
    Object.keys(mm).forEach((key) => {
      if (mm[key] !== null) {
        meanMaxes[`${label} ${key}`] = mm[key]
      } else {
        meanMaxes[`${label} ${key}`] = ''
      }
    })
  }
}

const pushTimeInZones = (timeInZones, metric, label) => {
  if (metric !== null) {
    const tiz = metric.TimeInZones
    Object.keys(tiz).forEach((key) => {
      timeInZones[`${label} Zone ${parseInt(key) + 1}`] = tiz[key].Seconds
      timeInZones[`${label} Zone ${parseInt(key) + 1} Min`] = tiz[key].Minimum
    })
  }
}

const is403Error = (error) => {
  return (error.message.search('403') >= 0)
}
