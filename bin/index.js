const CLI = require('clui')
const Spinner = CLI.Spinner

const tp = require('../lib/trainingpeaks')
const persist = require('../lib/persist')

const wtAthleteIds = [
  526989, // DOWSETT Alex
  1854568, // BADILATTI Matteo
  2551795, // BARBIER Rudy
  1370771, // BIERMANS Jenthe
  667695, // BOIVIN Guillaume
  1573826, // BRÄNDLE Matthias
  1756780, // CATAFORD Alexander
  2325944, // CIMOLAI Davide
  926250, // EINHORN Itamar
  1910930, // GOLDSTEIN Omer
  1191365, // GREIPEL André
  219467, // HERMANS Ben
  2977916, // HOFSTETTER Hugo
  1816011, // HOLLENSTEIN Reto
  363679, // MARTIN Dan
  548250, // MCCABE Travis
  2495489, // NAVARRO Daniel
  1156869, // NEILANDS Krists
  707098, // NIV Guy
  1188099, // PICCOLI James
  1826270, // POLITT Nils
  1580521, // RÄIM Mihkel
  2691798, // RENARD Alexis
  1580539, // SAGIV Guy
  2174391, // SCHELLING Patrick
  579304, // SUTHERLAND Rory
  2235229, // VAHTRA Norman
  1581377, // VAN ASBROECK Tom
  728200, // WÜRTZ SCHMIDT Mads
  1147022 // ZABEL Rick
]

const contiAthleteIds = [
  2585918,
  1167197,
  1298589, // BEAR Ido
  2200010, // BEN MOSHE Yuval
  3058768,
  2176572,
  2200392,
  1901490,
  1964614,
  2177695,
  1538699,
  1272653,
  432603,
  2765282,
  1375312
]

const workoutKeys = [

  /* Basic Information */
  'Id',
  'Athlete',
  'AthleteId',
  'Mass',
  'WorkoutType',
  'WorkoutDay',
  'StartTime',
  'WorkoutWeek',
  'WorkoutMonth',
  'Title',
  'Tags',

  /* Duration */
  'TotalTime',

  /* Length */
  'Distance',

  /* Power & Energy output data */
  'Calories',
  'Energy',
  'PowerAverage',
  'PowerMaximum',
  'NormalizedPower',
  'IF',
  'TssActual',
  'TssCalculationMethod',

  /* Speed Data */
  'VelocityAverage',
  'VelocityMaximum',

  /* Cadence Data */
  'CadenceAverage',
  'CadenceMaximum',

  /* Heart Rate Data */
  'HeartRateAverage',
  'HeartRateMaximum',
  'HeartRateMinimum',

  /* Elevation Data */
  'ElevationGain',
  'ElevationLoss',
  'ElevationAverage',
  'ElevationMaximum',
  'ElevationMinimum',

  /* Temperature Data */
  'TempAvg',
  'TempMin',
  'TempMax',

  /* Mean Max Power Data */
  'Power 5Seconds',
  'Power 10Seconds',
  'Power 12Seconds',
  'Power 20Seconds',
  'Power 30Seconds',
  'Power 1Minute',
  'Power 2Minutes',
  'Power 5Minutes',
  'Power 6Minutes',
  'Power 10Minutes',
  'Power 12Minutes',
  'Power 20Minutes',
  'Power 30Minutes',
  'Power 1Hour',
  'Power 90Minutes',
  'Power 3Hours',

  /* Power Zones Data */
  'Power Zone 1',
  'Power Zone 2',
  'Power Zone 3',
  'Power Zone 4',
  'Power Zone 5',
  'Power Zone 6',
  'Power Zone 7',
  'Power Zone 1 Min',
  'Power Zone 2 Min',
  'Power Zone 3 Min',
  'Power Zone 4 Min',
  'Power Zone 5 Min',
  'Power Zone 6 Min',
  'Power Zone 7 Min',

  /* Mean Max HR Data */
  'HR 5Seconds',
  'HR 10Seconds',
  'HR 12Seconds',
  'HR 20Seconds',
  'HR 30Seconds',
  'HR 1Minute',
  'HR 2Minutes',
  'HR 5Minutes',
  'HR 6Minutes',
  'HR 10Minutes',
  'HR 12Minutes',
  'HR 20Minutes',
  'HR 30Minutes',
  'HR 1Hour',
  'HR 90Minutes',
  'HR 3Hours',

  /* HR Zones Data */
  'HR Zone 1',
  'HR Zone 2',
  'HR Zone 3',
  'HR Zone 4',
  'HR Zone 5',
  'HR Zone 1 Min',
  'HR Zone 2 Min',
  'HR Zone 3 Min',
  'HR Zone 4 Min',
  'HR Zone 5 Min',

  /* Mean Max Speed Data */
  'Speed 5Seconds',
  'Speed 10Seconds',
  'Speed 12Seconds',
  'Speed 20Seconds',
  'Speed 30Seconds',
  'Speed 1Minute',
  'Speed 2Minutes',
  'Speed 5Minutes',
  'Speed 6Minutes',
  'Speed 10Minutes',
  'Speed 12Minutes',
  'Speed 20Minutes',
  'Speed 30Minutes',
  'Speed 1Hour',
  'Speed 90Minutes',
  'Speed 3Hours',

  /* Speed Zones Data */
  'Speed Zone 1',
  'Speed Zone 2',
  'Speed Zone 3',
  'Speed Zone 4',
  'Speed Zone 5',
  'Speed Zone 6',
  'Speed Zone 7',
  'Speed Zone 1 Min',
  'Speed Zone 2 Min',
  'Speed Zone 3 Min',
  'Speed Zone 4 Min',
  'Speed Zone 5 Min',
  'Speed Zone 6 Min',
  'Speed Zone 7 Min',

  /* Mean Max Cadence Data */
  'Cadence 5Seconds',
  'Cadence 10Seconds',
  'Cadence 12Seconds',
  'Cadence 20Seconds',
  'Cadence 30Seconds',
  'Cadence 1Minute',
  'Cadence 2Minutes',
  'Cadence 5Minutes',
  'Cadence 6Minutes',
  'Cadence 10Minutes',
  'Cadence 12Minutes',
  'Cadence 20Minutes',
  'Cadence 30Minutes',
  'Cadence 1Hour',
  'Cadence 90Minutes',
  'Cadence 3Hours',

  /* Mean Max Distance Data
  'Distance 400Meter',
  'Distance 800Meter',
  'Distance 1Kilometer',
  'Distance 1600Meter',
  'Distance 1Mile',
  'Distance 5Kilometer',
  'Distance 5Mile',
  'Distance 10Kilometer',
  'Distance 15Kilometer',
  'Distance 10Mile',
  'Distance HalfMarathon',
  'Distance 30Kilometer',
  'Distance Marathon',
  'Distance 50Kilometer',
  'Distance 100Kilometer',
  'Distance 100Mile',
  */

  'Hidden',
  'Locked'
]

const metricKeys = [

  /* Basic Information */
  'MetricId', // int
  'Athlete', // Custom Field to show the First Name and Last Name
  'AthleteId', // int
  'DateTime', // datetime

  /* Body Comp */
  'WeightInKilograms', // kg Min: 0 Max: 1000
  'SkinFold', // mm Min: 0 Max: 300
  'BMI', // kg/m2 Min:0 Max:50
  'PercentFat', // percent Min:0 Max:80
  'MuscleMass', // kg Min:0 Max:1000
  'WaterPercent', // percent Min: 0 Max: 1000

  /* Subjective */
  'OverallFeeling', // Horrible, ExtremelyPoor, Poor, Bad, BelowAverage, AboveAverage, Good, Superior ExtremelySuperior Best
  'Fatigue', // None, VeryLow, Low, Average, High, VeryHigh Extreme
  'Mood', // WorseThanNormal, Normal, BetterThanNormal
  'Motivation', // ExtremelyUnmotivated, VeryUnmotivated, Unmotivated, Uninspired, BelowAverage, AboveAverage, Inspired, Motivated, VeryMotivated, ExtremelyMotivated
  'Soreness', // None, ExtremelyLow, VeryLow, Low, ModeratelyLow, Moderate, ModeratelyHigh, High, VeryHigh, Extreme
  'Stress', // None, VeryLow, Low, Average, High, VeryHigh, Extreme
  'YesterdaysTraining', // WorseThanNormal, Normal, BetterThanNormal RestDay

  /* Metabolic */
  'BMR', // kcal/day Min: 500 Max: 20000
  'Appetite', // ExtremelyHungry, VeryHungry, Hungry, Satisfied, Full, VeryFull ExtremelyFull
  'BloodGlucose', // mg/dL Min: 0 Max: 600
  'InsulinUnits', // Min: 0 Max: 10000
  'InsulinType', //
  'RMR', // kcal/day Min: 500 Max: 5000

  /* Physical */
  'RestwiseScore', // Score10, Score20, Score30, Score40, Score50, Score60, Score70, Score80, Score90 Score100
  'Menstruation', // None, VeryLight, Light, Medium, Heavy, VeryHeavy Extreme
  'Sickness', // ExtremelySick, VerySick, Sick, SlightlySick, Healthy ExtremelyHealthy
  'SPO2', // percent Min: 0 Max: 100
  'Steps', // count Min: 0 Max: 1000000000

  /* HR and Blood Pressure */
  'Pulse', // BPM Min:10 Max:200
  'HRV', // min:0 Max:200
  'Systolic', // mmHg Min: 50 Max: 230
  'Diastolic', // mmHg Min:10 Max:140
  'Injury', // ExtremelyInjured, VeryInjured, Injured, SlightlyInjured, BelowAverage, AboveAverage, Well Healthy, VeryHealthy, ExtremelyHealthy

  /* Sleep */
  'SleepElevationInMeters', // meters Min:-457 Max: 9144
  'SleepHours', // hours Min: 0 Max:72
  'SleepQuality', // Horrible, Poor, Bad, Average, Good, Better Best
  'NumberTimesWoken', // count Min:0 Max:1000
  'TimeInDeepSleep', // hours Min: 0 Max: 72
  'TimeInLightSleep', // hours Min: 0 Max: 72
  'TimeInRemSleep', // hours Min: 0 Max: 72
  'TotalTimeAwake', // hours Min: 0 Max: 72

  /* Hydration */
  'HydrationLevel', // ExtremelyHydrated, VeryHydrated, Hydrated, Normal, Dehydrated, VeryDehydrated, ExtremelyDehydrated
  'WaterConsumption', // ml Min: 0 Max: 29573
  'UrineColor', // Clear, LightYellow, MediumYellow, Yellow, LightOrange, MediumOrange Orange

  /* Notes */
  'Notes' //
]

const dateWithoutTime = (date) => {
  var dt = new Date(date)
  return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate())
}

const massOnWorkoutDate = (masses, workoutDate, defaultKg) => {
  var kg = defaultKg
  masses.forEach((entry) => {
    var kgDate = dateWithoutTime(entry.date)
    var wkoDate = dateWithoutTime(workoutDate)
    if (kgDate <= wkoDate) {
      kg = entry.mass
    }
  })
  return kg
}

const weekNumber = (date) => {
  var tdt = new Date(date.valueOf())
  var dayn = (date.getDay() + 6) % 7

  tdt.setDate(tdt.getDate() - dayn + 3)

  var firstThursday = tdt.valueOf()

  tdt.setMonth(0, 1)

  if (tdt.getDay() !== 4) {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7)
  }

  return 1 + Math.ceil((firstThursday - tdt) / 604800000)
}

const monthNumber = (date) => {
  return 1 + date.getMonth()
}

const addDays = (date, days) => {
  var result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}

/* YYYY-MM-DD */
const tpDateFormat = (date) => {
  return date.toISOString().substring(0, 10)
}

const stringCSV = (keys, results, name) => {
  var string = ''

  /* Write Headers to File */
  keys.forEach(key => {
    string = string + `${key}\t`
  })
  string = string + '\n'

  /* Write Results to File */
  results.forEach((result) => {
    keys.forEach((key) => {
      /* Write the key if it exists */
      if (Object.prototype.hasOwnProperty.call(result, key)) {
        string = string + `${result[key]}`
      }
      /* Delimit with a Tab */
      string = string + '\t'
    })

    string = string + '\n'
  })

  return string
}

const run = async (req, res) => {
  const status = new Spinner('Authenticating with TrainingPeaks, please wait...')

  const args = process.argv.slice(2)

  /* args[0] is WT or Conti - default to WT */
  var ids = []
  if (args[0] === 'Conti') {
    ids = contiAthleteIds
  } else {
    ids = wtAthleteIds
  }

  /* args[1] is start date - default to today
     args[2] *optional* is end date. If empty end = start */
  var startDate
  if (args.length > 1) {
    startDate = new Date(args[1])
  } else {
    startDate = new Date()
  }
  var endDate
  if (args.length > 2) {
    endDate = new Date(args[2])
  } else {
    endDate = startDate
  }

  const analyzeWorkouts = true
  const analyzeMetrics = false

  try {
    status.start()

    status.message('Login...')
    await tp.login()

    status.message()

    status.message('Fetching athletes...')
    const athletes = await tp.getAthletes()

    /* TP Date Query Length is Max 45 days so it may need to broken up */
    /* We break it up into 4-week (or less) cycles */
    const startEndDates = []
    var startD = startDate
    var endD = startDate
    do {
      endD = addDays(endD, 28)
      if (endD > endDate) {
        endD = endDate
      }

      startEndDates.push({
        start: tpDateFormat(startD),
        end: tpDateFormat(endD)
      })

      startD = addDays(endD, 1)
    } while (endD < endDate)

    var athleteMasses = []
    var athleteMetrics = []
    var athleteWorkouts = []

    for (const dt of startEndDates) {
      const startDate = dt.start
      const endDate = dt.end

      for (const athlete of athletes) {
        /* Reset the Mass Data */
        athleteMasses = []

        if (ids.includes(athlete.Id)) {
          /* METRICS */
          status.message(`Analyzing metrics for ${athlete.FirstName} ${athlete.LastName}, please wait...`)
          var metrics = await tp.getAthleteMetrics(athlete, startDate, endDate)
          if (metrics !== undefined) {
            if (metrics.length > 0) {
              metrics.forEach((metric) => {
                metric.Athlete = `${athlete.FirstName} ${athlete.LastName}`
                athleteMetrics.push(metric)

                if (Object.prototype.hasOwnProperty.call(metric, 'WeightInKilograms')) {
                  if (metric.WeightInKilograms !== null) {
                    athleteMasses.push({
                      date: metric.DateTime,
                      mass: metric.WeightInKilograms
                    })
                  }
                }
              })
            }
          }

          /* WORKOUTS */
          if (analyzeWorkouts) {
            status.message(`Fetching workouts for ${athlete.FirstName} ${athlete.LastName}, please wait...`)
            const workouts = await tp.getWorkouts(athlete, startDate, endDate)

            status.message(`Analyzing workouts for ${athlete.FirstName} ${athlete.LastName}, please wait...`)
            for (var workout of workouts) {
              var workoutDate = new Date(workout.WorkoutDay)

              // Add Rider Name, Rider Mass, Week Number and Month Number to the Start of the workout
              workout = {
                Athlete: `${athlete.FirstName} ${athlete.LastName}`,
                Mass: massOnWorkoutDate(athleteMasses, workoutDate, athlete.Weight),
                WorkoutWeek: weekNumber(workoutDate),
                WorkoutMonth: monthNumber(workoutDate),
                ...workout
              }

              // Convert Tags to a string if it is an array
              if (workout.Tags !== undefined) {
                if (Array.isArray(workout.Tags)) {
                  workout.Tags = workout.Tags.toString()
                }
              } else {
                workout.Tags = ''
              }

              // Add Mean Max Powers and Power Zones if it is a Bike workout
              if (workout.WorkoutType === 'Bike') {
                const meanMaxes = await tp.getWorkoutMeanMaxes(athlete, workout)
                workout = { ...workout, ...meanMaxes }

                const timeInZones = await tp.getWorkoutTimeInZones(athlete, workout)
                workout = { ...workout, ...timeInZones }
              }

              athleteWorkouts.push(workout)
            }
          }
        }
      }

      /* Reset Arrays for next block of dates */
      // athleteWorkouts = []
      // athleteMetrics = []
    }

    // Sort the Array Ascending by Workout Day
    athleteWorkouts.sort((a, b) => {
      return new Date(b.WorkoutDay) - new Date(a.WorkoutDay)
    })

    if (analyzeWorkouts) {
      persist.toCSV(workoutKeys, athleteWorkouts, 'Workouts')
    }
    if (analyzeMetrics) {
      persist.toCSV(metricKeys, athleteMetrics, 'Metrics')
    }

    status.stop()
  } catch (error) {
    status.stop()
    console.log(error)
  }
}

run()
