import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY || '';
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// ----------------------------------------------------
// Health Check Endpoint (Required by brief & tests)
// ----------------------------------------------------
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// ----------------------------------------------------
// OpenAPI Spec & Swagger UI (FastAPI Style)
// ----------------------------------------------------
const openApiSchema = {
  openapi: '3.0.3',
  info: {
    title: 'FitBuddy API',
    description: 'AI-Powered Personalized 7-Day Workout and Fitness Plan Generator',
    version: '1.0.0',
    contact: {
      name: 'FitBuddy Support',
    },
  },
  servers: [
    {
      url: '/',
      description: 'Default Server',
    },
  ],
  paths: {
    '/api/health': {
      get: {
        summary: 'Health Check',
        description: 'Returns server operational status',
        responses: {
          '200': {
            description: 'Server is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/generate-plan': {
      post: {
        summary: 'Generate 7-Day Fitness Plan',
        description: 'Creates a custom 7-day workout and nutrition plan powered by Gemini AI',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'age', 'weight', 'goal', 'intensity', 'experience', 'preference'],
                properties: {
                  name: { type: 'string', example: 'Kavin' },
                  age: { type: 'integer', example: 20 },
                  weight: { type: 'number', example: 65, description: 'Weight in kilograms' },
                  goal: { type: 'string', example: 'Muscle Gain' },
                  intensity: { type: 'string', enum: ['Low', 'Medium', 'High'], example: 'Medium' },
                  experience: { type: 'string', enum: ['Beginner', 'Intermediate', 'Advanced'], example: 'Beginner' },
                  preference: { type: 'string', example: 'Home Workout' },
                  additionalNotes: { type: 'string', example: 'No equipment except dumbbells and pullup bar' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Custom 7-day fitness plan generated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    overview: { type: 'string' },
                    version: { type: 'integer' },
                    weeklyTargetCalories: { type: 'number' },
                    targetProteinGrams: { type: 'number' },
                    cardioMinutesWeekly: { type: 'number' },
                    recoveryDaysCount: { type: 'number' },
                    days: {
                      type: 'array',
                      items: {
                        type: 'object',
                        properties: {
                          dayNumber: { type: 'integer' },
                          dayName: { type: 'string' },
                          focus: { type: 'string' },
                          isRestDay: { type: 'boolean' },
                          warmup: { type: 'string' },
                          exercises: {
                            type: 'array',
                            items: {
                              type: 'object',
                              properties: {
                                name: { type: 'string' },
                                sets: { type: 'integer' },
                                reps: { type: 'string' },
                                rest: { type: 'string' },
                                targetMuscle: { type: 'string' },
                                tips: { type: 'string' },
                              },
                            },
                          },
                          cardio: { type: 'string' },
                          cooldown: { type: 'string' },
                          nutritionTip: { type: 'string' },
                          hydrationTip: { type: 'string' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/api/regenerate-plan': {
      post: {
        summary: 'Regenerate Plan with User Feedback',
        description: 'Updates an existing 7-day plan by applying feedback (e.g. Add more cardio and include more recovery)',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['currentPlan', 'feedback'],
                properties: {
                  currentPlan: { type: 'object' },
                  feedback: { type: 'string', example: 'Add more cardio and include more recovery.' },
                },
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Plan updated with feedback applied',
          },
        },
      },
    },
  },
};

app.get('/openapi.json', (_req: Request, res: Response) => {
  res.json(openApiSchema);
});

// Swagger UI HTML (FastAPI replica)
const swaggerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>FitBuddy - Swagger UI (FastAPI docs)</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
  <link rel="icon" type="image/png" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/favicon-32x32.png" />
  <style>
    body { margin: 0; background: #fafafa; }
    .topbar { display: none !important; }
    .swagger-ui .info { margin: 25px 0; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: '/openapi.json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "BaseLayout",
        deepLinking: true,
        showExtensions: true,
        showCommonExtensions: true
      });
    };
  </script>
</body>
</html>`;

app.get('/docs', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(swaggerHtml);
});

app.get('/api/docs', (_req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(swaggerHtml);
});

// ----------------------------------------------------
// Fallback Plan Generator (Ensures 100% Reliability)
// ----------------------------------------------------
function generateProceduralPlan(profile: any, feedback?: string): any {
  const isGain = profile.goal?.toLowerCase().includes('gain') || profile.goal?.toLowerCase().includes('muscle') || profile.goal?.toLowerCase().includes('hypertrophy');
  const isLoss = profile.goal?.toLowerCase().includes('loss') || profile.goal?.toLowerCase().includes('cut');
  const isHome = profile.preference?.toLowerCase().includes('home');
  const hasCardioFeedback = feedback ? /cardio|running|jog|hiit/i.test(feedback) : false;
  const hasRecoveryFeedback = feedback ? /recovery|rest|stretching|relax|sore/i.test(feedback) : false;

  // Calorie & protein targets calculation
  const bmr = 10 * profile.weight + 6.25 * 175 - 5 * profile.age + 5;
  const tdee = bmr * (profile.intensity === 'High' ? 1.55 : profile.intensity === 'Low' ? 1.2 : 1.375);
  const targetCalories = Math.round(isGain ? tdee + 350 : isLoss ? tdee - 450 : tdee);
  const targetProtein = Math.round(profile.weight * (isGain ? 2.0 : 1.8));

  // Determine recovery days: if user asked for more recovery, allocate 2 or 3 recovery days
  const recoveryDays = hasRecoveryFeedback ? [3, 7] : [4, 7];

  const days = [
    {
      dayNumber: 1,
      dayName: 'Day 1: Upper Body Push & Core Foundation',
      focus: isHome ? 'Chest, Shoulders, Triceps (Bodyweight & Home Focus)' : 'Chest & Triceps Hypertrophy',
      isRestDay: false,
      warmup: '5 mins arm circles, dynamic chest openers, cat-cow stretch, and jumping jacks',
      exercises: isHome
        ? [
            { id: 'e1', name: 'Standard / Incline Push-ups', sets: 4, reps: '10-15', rest: '60s', targetMuscle: 'Chest & Shoulders', tips: 'Keep core tight, elbows at a 45-degree angle.' },
            { id: 'e2', name: 'Chair or Bench Dips', sets: 3, reps: '12-15', rest: '60s', targetMuscle: 'Triceps', tips: 'Lower down slowly until elbows hit 90 degrees.' },
            { id: 'e3', name: 'Pike Push-ups', sets: 3, reps: '8-12', rest: '75s', targetMuscle: 'Anterior Deltoids', tips: 'Hips elevated high, look toward toes.' },
            { id: 'e4', name: 'Plank to Push-up Transitions', sets: 3, reps: '8 each side', rest: '45s', targetMuscle: 'Core & Stabilizers', tips: 'Minimize hip swaying as you press up.' },
            { id: 'e5', name: 'Dead Bug Holds', sets: 3, reps: '12 reps', rest: '45s', targetMuscle: 'Transverse Abdominis', tips: 'Press your lower back firmly into the floor.' },
          ]
        : [
            { id: 'e1', name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest: '90s', targetMuscle: 'Chest', tips: 'Retract scapula and drive through your heels.' },
            { id: 'e2', name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest: '75s', targetMuscle: 'Upper Chest', tips: 'Control the eccentric phase for 2-3 seconds.' },
            { id: 'e3', name: 'Overhead Dumbbell Shoulder Press', sets: 3, reps: '10', rest: '75s', targetMuscle: 'Deltoids', tips: 'Keep ribs locked down, no hyperextension.' },
            { id: 'e4', name: 'Cable Triceps Pushdown', sets: 3, reps: '12-15', rest: '60s', targetMuscle: 'Triceps', tips: 'Pin elbows to your ribs.' },
            { id: 'e5', name: 'Hanging Leg Raises', sets: 3, reps: '12-15', rest: '60s', targetMuscle: 'Abdominals', tips: 'Curl pelvis up rather than simply swinging legs.' },
          ],
      cardio: hasCardioFeedback
        ? '20 minutes Moderate-Intensity Steady State (brisk walk, light jog, or cycle at Zone 2 HR 120-135 bpm)'
        : '8 minutes brisk incline walking or light jump rope',
      cooldown: '5 mins doorway chest stretch, overhead triceps stretch, and child pose',
      nutritionTip: `Target ${Math.round(targetProtein / 4)}g protein in your post-workout meal with complex carbohydrates for glycogen replenishment.`,
      hydrationTip: 'Drink 600ml of water with a pinch of pink salt within 30 minutes of finishing.',
    },
    {
      dayNumber: 2,
      dayName: 'Day 2: Lower Body Power & Quad/Hamstring Focus',
      focus: 'Quads, Glutes, Hamstrings & Calves',
      isRestDay: false,
      warmup: '5 mins bodyweight squats, leg swings front-to-back and side-to-side, glute bridges',
      exercises: isHome
        ? [
            { id: 'e6', name: 'Tempo Bodyweight / Goblet Squats', sets: 4, reps: '15-20', rest: '60s', targetMuscle: 'Quadriceps & Glutes', tips: '3-second descent, explode up quickly.' },
            { id: 'e7', name: 'Walking Lunges', sets: 3, reps: '12 each leg', rest: '60s', targetMuscle: 'Glutes & Hamstrings', tips: 'Keep torso upright, back knee hovering above floor.' },
            { id: 'e8', name: 'Single-Leg Glute Bridges', sets: 3, reps: '12 each leg', rest: '45s', targetMuscle: 'Gluteus Maximus', tips: 'Pause and squeeze hard for 1 second at the top.' },
            { id: 'e9', name: 'Bulgarian Split Squats (Foot on Couch)', sets: 3, reps: '10 each leg', rest: '75s', targetMuscle: 'Quads & Balance', tips: 'Keep front shin relatively vertical for quad drive.' },
            { id: 'e10', name: 'Standing Calf Raises on Step', sets: 4, reps: '20 reps', rest: '45s', targetMuscle: 'Calves', tips: 'Full stretch at bottom, high rise on toes.' },
          ]
        : [
            { id: 'e6', name: 'Barbell Back Squats', sets: 4, reps: '8-10', rest: '120s', targetMuscle: 'Quads & Glutes', tips: 'Chest proud, knees tracking over toes.' },
            { id: 'e7', name: 'Romanian Deadlifts (Dumbbells/Barbell)', sets: 3, reps: '10-12', rest: '90s', targetMuscle: 'Hamstrings & Posterior Chain', tips: 'Hinge back at the hips, neutral spine.' },
            { id: 'e8', name: 'Leg Press', sets: 3, reps: '12', rest: '75s', targetMuscle: 'Quadriceps', tips: 'Avoid locking out knees aggressively at top.' },
            { id: 'e9', name: 'Lying Leg Curls', sets: 3, reps: '12-15', rest: '60s', targetMuscle: 'Hamstrings', tips: 'Control the weight back down slowly.' },
            { id: 'e10', name: 'Seated Calf Raises', sets: 4, reps: '15', rest: '45s', targetMuscle: 'Soleus', tips: 'Hold top squeeze for a 2 count.' },
          ],
      cardio: hasCardioFeedback
        ? '15 minutes Low Impact Cycling or incline treadmill walk to flush leg lactic acid'
        : '5 minutes cool-down walking',
      cooldown: '6 mins standing quad stretch, seated forward fold, and pigeon stretch',
      nutritionTip: 'Leg days burn high glycogen: enjoy brown rice, sweet potatoes, or oatmeal with lean chicken/tofu.',
      hydrationTip: 'Aim for 3.2L of total water intake today to prevent muscle cramping.',
    },
    {
      dayNumber: 3,
      dayName: hasRecoveryFeedback ? 'Day 3: Active Recovery, Mobility & Core Flow' : 'Day 3: Upper Body Pull & Posterior Chain',
      focus: hasRecoveryFeedback ? 'Full Body Mobility, Joint Health & Low-Stress Cardio' : 'Back, Lats, Rhomboids & Biceps',
      isRestDay: hasRecoveryFeedback,
      warmup: hasRecoveryFeedback ? 'Gentle breathing exercises & shoulder dislocations with towel' : '5 mins arm swings, band pull-aparts, thoracic twists',
      exercises: hasRecoveryFeedback
        ? [
            { id: 'e11', name: 'World\'s Greatest Stretch', sets: 3, reps: '5 each side', rest: '30s', targetMuscle: 'Hip Flexors & Thoracic', tips: 'Take deep breaths at the bottom of the lunge.' },
            { id: 'e12', name: 'Cat-Cow into Child\'s Pose Flow', sets: 3, reps: '10 cycles', rest: '30s', targetMuscle: 'Spine & Back Decompression', tips: 'Synchronize movement with inhalation and exhalation.' },
            { id: 'e13', name: 'Deep Squat Pry & Hold', sets: 3, reps: '45 sec hold', rest: '45s', targetMuscle: 'Hips & Ankles', tips: 'Chest tall, push knees out gently with elbows.' },
            { id: 'e14', name: 'Foam Rolling / Self-Myofascial Release', sets: 1, reps: '10 mins total', rest: 'None', targetMuscle: 'Quads, Lats & Upper Back', tips: 'Spend 60s on tender trigger points.' },
          ]
        : [
            { id: 'e11', name: isHome ? 'Inverted Table Rows or Door Pull-ins' : 'Lat Pulldowns / Pull-ups', sets: 4, reps: '10-12', rest: '75s', targetMuscle: 'Latissimus Dorsi', tips: 'Drive with elbows, feel lats engage.' },
            { id: 'e12', name: isHome ? 'Prone Y-T-W Floor Raises' : 'Bent Over Dumbbell Rows', sets: 3, reps: '12', rest: '60s', targetMuscle: 'Rhomboids & Mid-Back', tips: 'Squeeze shoulder blades together.' },
            { id: 'e13', name: isHome ? 'Backpack / Resistance Bicep Curls' : 'Dumbbell Bicep Hammer Curls', sets: 3, reps: '12-15', rest: '60s', targetMuscle: 'Biceps & Brachialis', tips: 'Keep wrists neutral and stationary.' },
            { id: 'e14', name: 'Face Pulls or Band Pull-Aparts', sets: 3, reps: '15-20', rest: '45s', targetMuscle: 'Rear Delts & Rotator Cuff', tips: 'Pull toward eyes, rotate external wrists.' },
          ],
      cardio: hasCardioFeedback
        ? '25 minutes Low-Intensity Aerobic Zone 2 Cardio (Brisk Outdoor Walk, Elliptical, or Swimming)'
        : (hasRecoveryFeedback ? '15 minutes relaxed walking in nature' : '10 minutes rowing machine or shadow boxing'),
      cooldown: '6 mins lat stretch on wall, cobra pose, and neck rolls',
      nutritionTip: hasRecoveryFeedback ? 'Prioritize anti-inflammatory foods: berries, turmeric, leafy greens, and omega-3s.' : 'High protein intake: consume 30-40g protein within 2 hours of pulling session.',
      hydrationTip: 'Add lemon or lime slices to water for refreshing hydration and trace electrolytes.',
    },
    {
      dayNumber: 4,
      dayName: hasRecoveryFeedback ? 'Day 4: Upper Body Pull & Arm Sculpting' : 'Day 4: Rest & Strategic Recovery',
      focus: hasRecoveryFeedback ? 'Lats, Rhomboids, Biceps & Grip' : 'Full Rest, Central Nervous System Restoration',
      isRestDay: !hasRecoveryFeedback,
      warmup: hasRecoveryFeedback ? 'Dynamic band pull-aparts and arm circles' : 'Light 10 min stroll',
      exercises: hasRecoveryFeedback
        ? [
            { id: 'e15', name: isHome ? 'Doorframe / Towel Pull-ups' : 'Seated Cable Row', sets: 4, reps: '10-12', rest: '75s', targetMuscle: 'Mid-Back & Lats', tips: 'Pull low toward belly button.' },
            { id: 'e16', name: isHome ? 'Bodyweight Inverted Rows' : 'Lat Pulldowns', sets: 3, reps: '10-12', rest: '60s', targetMuscle: 'Upper Back', tips: 'Control negative descent.' },
            { id: 'e17', name: 'Bicep Concentration Curls', sets: 3, reps: '12 reps', rest: '60s', targetMuscle: 'Biceps Peak', tips: 'Focus strictly on forearm flexion.' },
            { id: 'e18', name: 'Prone Cobra Holds', sets: 3, reps: '30s hold', rest: '45s', targetMuscle: 'Lower Back & Posture', tips: 'Thumbs pointing toward ceiling.' },
          ]
        : [
            { id: 'e15', name: 'Rest Day - No Weight Lifting', sets: 1, reps: 'Full Day', rest: 'All Day', targetMuscle: 'Systemic Recovery', tips: 'Allow muscle fibers to repair and synthesize new protein.' },
          ],
      cardio: hasCardioFeedback
        ? '20 minutes steady incline walking or easy outdoor cycle'
        : 'None - complete rest for optimal CNS regeneration',
      cooldown: '5 mins gentle full body stretching',
      nutritionTip: 'Keep protein steady at target levels even on rest days for ongoing muscle protein synthesis.',
      hydrationTip: 'Aim for a minimum of 2.5L clean water spread evenly across the day.',
    },
    {
      dayNumber: 5,
      dayName: 'Day 5: Full Body Functional Hypertrophy',
      focus: 'Compound Movements, Core & Conditioning',
      isRestDay: false,
      warmup: '5 mins jumping jacks, high knees, inchworms, and torso twists',
      exercises: [
        { id: 'e19', name: isHome ? 'Decline / Feet-Elevated Push-ups' : 'Dumbbell Incline Chest Flyes', sets: 3, reps: '12-15', rest: '60s', targetMuscle: 'Upper Chest', tips: 'Slight bend in elbows throughout.' },
        { id: 'e20', name: isHome ? 'Jump Squats / Explosive Squats' : 'Goblet Squats with Heavy Dumbbell', sets: 3, reps: '12', rest: '75s', targetMuscle: 'Quads & Explosiveness', tips: 'Land softly on the midfoot.' },
        { id: 'e21', name: 'Plank with Shoulder Taps', sets: 3, reps: '16 total', rest: '45s', targetMuscle: 'Anti-Rotational Core', tips: 'Keep hips square and motionless.' },
        { id: 'e22', name: 'Mountain Climbers', sets: 3, reps: '30 seconds', rest: '45s', targetMuscle: 'Core & Cardiovascular', tips: 'Drive knees rhythmically toward chest.' },
        { id: 'e23', name: 'Superman Holds', sets: 3, reps: '12 reps (2s hold)', rest: '45s', targetMuscle: 'Erector Spinae & Glutes', tips: 'Lift chest and thighs off floor simultaneously.' },
      ],
      cardio: hasCardioFeedback
        ? '25 minutes High/Moderate Hybrid Cardio (5 min warm up, 10 min intervals: 1 min fast / 1 min moderate, 10 min steady)'
        : '12 minutes HIIT or steady jog',
      cooldown: '6 mins standing hamstring stretch, butterfly stretch, and deep diaphragmatic breathing',
      nutritionTip: 'High metabolic day: refuel with a nutrient-dense shake (whey/plant protein, banana, peanut butter, oats).',
      hydrationTip: 'Drink 500ml of water 15 minutes before your session begins.',
    },
    {
      dayNumber: 6,
      dayName: hasCardioFeedback ? 'Day 6: Dedicated Cardio Conditioning & Core Shred' : 'Day 6: Lower Body Glute/Hamstring & Arms',
      focus: hasCardioFeedback ? 'Cardiovascular Stamina, Aerobic Capacity & Core Endurance' : 'Hamstrings, Glutes, Biceps & Triceps',
      isRestDay: false,
      warmup: '5 mins dynamic skipping, butt-kicks, ankle circles, and hip rotations',
      exercises: hasCardioFeedback
        ? [
            { id: 'e24', name: 'Aerobic Interval Circuit (Run / Cycle / Row)', sets: 5, reps: '3 mins work / 1 min rest', rest: '60s', targetMuscle: 'Cardiorespiratory System', tips: 'Maintain steady 80% maximum heart rate.' },
            { id: 'e25', name: 'Bicycle Crunches', sets: 3, reps: '20 total', rest: '45s', targetMuscle: 'Obliques & Rectus Abdominis', tips: 'Slow and controlled, do not pull on neck.' },
            { id: 'e26', name: 'Hollow Body Holds', sets: 3, reps: '30-40 seconds', rest: '45s', targetMuscle: 'Deep Core Stabilization', tips: 'Lower back glued to floor, point toes.' },
            { id: 'e27', name: 'Russian Twists', sets: 3, reps: '20 total', rest: '45s', targetMuscle: 'Rotational Core', tips: 'Twist through the ribcage, not just the hands.' },
          ]
        : [
            { id: 'e24', name: 'Romanian Deadlifts (or Single-Leg Bodyweight)', sets: 4, reps: '10-12', rest: '75s', targetMuscle: 'Hamstrings & Glutes', tips: 'Feel the stretch in the posterior chain.' },
            { id: 'e25', name: 'Calf Raises & Shin Raises', sets: 3, reps: '20 reps', rest: '45s', targetMuscle: 'Lower Legs', tips: 'Control both top and bottom positions.' },
            { id: 'e26', name: 'Diamond Push-ups', sets: 3, reps: '10-12', rest: '60s', targetMuscle: 'Triceps Inner Head', tips: 'Hands in diamond shape beneath center of chest.' },
            { id: 'e27', name: 'Bicep Hammer Curls', sets: 3, reps: '12 reps', rest: '60s', targetMuscle: 'Biceps & Forearms', tips: 'No momentum swinging.' },
          ],
      cardio: hasCardioFeedback
        ? '30 minutes sustained Zone 2 cardio (Jogging, Cycling, or Rowing) for peak cardiovascular health'
        : '10 minutes moderate incline walking',
      cooldown: '8 mins thorough yoga-inspired cool down (Downward dog, cobra, lizard pose)',
      nutritionTip: 'Replenish electrolytes lost through perspiration with coconut water or electrolyte powder.',
      hydrationTip: 'Weigh in before and after session to replace 1.5x of fluid lost in sweat.',
    },
    {
      dayNumber: 7,
      dayName: 'Day 7: Deep Recovery, Nervous System Reset & Plan Review',
      focus: 'Total Rest, Mindful Recovery, Weekly Reflection',
      isRestDay: true,
      warmup: 'Gentle morning breathwork and 5 min easy outdoor walk in morning sunlight',
      exercises: [
        { id: 'e28', name: 'Rest Day - Growth & Repair Protocol', sets: 1, reps: 'Full Day', rest: 'All Day', targetMuscle: 'Complete Body Regeneration', tips: 'Muscles grow during rest, not during workouts. Prioritize 8 hours of sleep.' },
        { id: 'e29', name: 'Full Body Passive Static Stretching', sets: 1, reps: '15 mins', rest: 'None', targetMuscle: 'All Major Muscle Groups', tips: 'Hold each stretch for 30-45 seconds without bouncing.' },
      ],
      cardio: hasCardioFeedback
        ? '20 minutes relaxing low-heart-rate recovery walk (Zone 1, <110 bpm)'
        : '15 minutes easy walk outside',
      cooldown: 'Evening warm bath or shower and 10 mins reading before sleep',
      nutritionTip: 'Weekly meal prep day: cook lean proteins, sweet potatoes, and steam greens for the upcoming week.',
      hydrationTip: 'Aim for 3.0L water, limit caffeine past 2 PM to protect deep sleep.',
    },
  ];

  return {
    id: 'plan_' + Date.now(),
    title: `${profile.name}'s Custom 7-Day ${profile.goal} Plan`,
    overview: `Specially crafted for ${profile.name} (${profile.age} yrs, ${profile.weight}kg), designed for ${profile.goal} with a ${profile.intensity.toLowerCase()} intensity schedule. Focuses on ${profile.preference.toLowerCase()} execution, progressive overload, and dialed-in recovery.`,
    user: profile,
    createdAt: new Date().toISOString(),
    version: feedback ? 2 : 1,
    weeklyTargetCalories: targetCalories,
    targetProteinGrams: targetProtein,
    cardioMinutesWeekly: hasCardioFeedback ? 135 : 45,
    recoveryDaysCount: days.filter(d => d.isRestDay).length,
    days: days,
    generalAdvice: [
      `Maintain a progressive overload mentality: aim to add 1 rep or slight resistance each week.`,
      `Hit your ${targetProtein}g daily protein target consistently across 3-4 meals.`,
      `Quality sleep (7.5-8.5 hours) is the #1 natural anabolic window for ${profile.goal}.`,
      `Drink water steadily throughout the day, targeting 35ml per kg of body weight (${Math.round(profile.weight * 35 / 100) / 10}L).`,
    ],
    feedbackHistory: feedback
      ? [
          {
            feedback: feedback,
            appliedAt: new Date().toISOString(),
            summaryOfChanges: hasCardioFeedback && hasRecoveryFeedback
              ? 'Added 2 dedicated Zone 2/active cardio sessions (total weekly cardio increased to 135 mins) and expanded active recovery days to optimize tissue repair.'
              : hasCardioFeedback
              ? 'Increased weekly cardio sessions and duration to optimize cardiovascular endurance and fat burn.'
              : 'Enhanced recovery protocols, added mobility routines, and adjusted rest day frequency.',
          },
        ]
      : [],
  };
}

// ----------------------------------------------------
// AI Generation Endpoints
// ----------------------------------------------------
app.post('/api/generate-plan', async (req: Request, res: Response) => {
  const profile = req.body;
  if (!profile || !profile.name || !profile.goal) {
    return res.status(400).json({ error: 'Name and goal are required' });
  }

  // Try Gemini AI if client is available
  if (aiClient) {
    try {
      const prompt = `Generate a comprehensive, scientifically optimized 7-day fitness workout and nutrition plan in valid JSON format for this user:
Name: ${profile.name}
Age: ${profile.age}
Weight: ${profile.weight} kg
Fitness Goal: ${profile.goal}
Workout Intensity: ${profile.intensity}
Experience Level: ${profile.experience}
Workout Preference: ${profile.preference}
Additional Notes: ${profile.additionalNotes || 'None'}

Return a single JSON object conforming strictly to this structure:
{
  "id": "plan_${Date.now()}",
  "title": "${profile.name}'s Custom 7-Day ${profile.goal} Plan",
  "overview": "2-3 sentences overview of the strategy and phase",
  "version": 1,
  "weeklyTargetCalories": number (calculated daily calories),
  "targetProteinGrams": number (calculated daily grams of protein),
  "cardioMinutesWeekly": number,
  "recoveryDaysCount": number,
  "generalAdvice": ["advice 1", "advice 2", "advice 3", "advice 4"],
  "days": [
    {
      "dayNumber": 1,
      "dayName": "Day 1: Upper Body Push & Core",
      "focus": "Chest, Triceps, Shoulders",
      "isRestDay": false,
      "warmup": "warmup instructions",
      "exercises": [
        {
          "id": "e1",
          "name": "Exercise Name",
          "sets": 4,
          "reps": "8-12",
          "rest": "60s",
          "targetMuscle": "Muscle",
          "tips": "Form tip"
        }
      ],
      "cardio": "cardio duration & type",
      "cooldown": "cooldown stretches",
      "nutritionTip": "specific meal/macro tip",
      "hydrationTip": "hydration amount"
    }
    // repeat for all 7 days (dayNumber 1 to 7)
  ]
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an elite, certified master strength and conditioning coach and sports nutritionist. Create a practical, inspiring, realistic 7-day plan matching the user preference and experience level exactly. Format strictly as JSON.',
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText.trim());
        parsed.user = profile;
        parsed.createdAt = new Date().toISOString();
        if (!parsed.feedbackHistory) parsed.feedbackHistory = [];
        return res.json(parsed);
      }
    } catch (err) {
      console.warn('Gemini generation failed, falling back to procedural engine:', err);
    }
  }

  // Resilient fallback
  const plan = generateProceduralPlan(profile);
  res.json(plan);
});

app.post('/api/regenerate-plan', async (req: Request, res: Response) => {
  const { currentPlan, feedback } = req.body;
  if (!currentPlan || !feedback) {
    return res.status(400).json({ error: 'currentPlan and feedback are required' });
  }

  const profile = currentPlan.user || {
    name: 'Kavin',
    age: 20,
    weight: 65,
    goal: 'Muscle Gain',
    intensity: 'Medium',
    experience: 'Beginner',
    preference: 'Home Workout',
  };

  if (aiClient) {
    try {
      const prompt = `Here is an existing 7-day fitness plan for ${profile.name}:
${JSON.stringify(currentPlan, null, 2)}

The user provided this feedback / change request:
"${feedback}"

Update and regenerate the 7-day plan incorporating the user's feedback precisely (e.g. if they request more cardio and more recovery, increase the cardio durations/sessions, convert a strenuous lifting day into an active recovery / mobility / stretch day, add recovery protocols, etc.).
Increment the version number to ${((currentPlan.version || 1) + 1)}.
Return the updated plan in the exact same JSON format, including a "feedbackHistory" array with an entry:
{
  "feedback": "${feedback}",
  "appliedAt": "${new Date().toISOString()}",
  "summaryOfChanges": "Clear 1-2 sentence explanation of the specific modifications made"
}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          systemInstruction: 'You are an elite fitness trainer refining a workout plan based on client feedback. Return only valid JSON conforming to the fitness plan schema.',
        },
      });

      const responseText = response.text;
      if (responseText) {
        const parsed = JSON.parse(responseText.trim());
        parsed.user = profile;
        parsed.version = (currentPlan.version || 1) + 1;
        parsed.createdAt = new Date().toISOString();
        if (!parsed.feedbackHistory || parsed.feedbackHistory.length === 0) {
          parsed.feedbackHistory = [
            ...(currentPlan.feedbackHistory || []),
            {
              feedback: feedback,
              appliedAt: new Date().toISOString(),
              summaryOfChanges: `Updated plan based on: "${feedback}"`,
            },
          ];
        }
        return res.json(parsed);
      }
    } catch (err) {
      console.warn('Gemini regeneration failed, falling back to procedural refinement:', err);
    }
  }

  // Fallback regeneration
  const updatedPlan = generateProceduralPlan(profile, feedback);
  updatedPlan.version = (currentPlan.version || 1) + 1;
  updatedPlan.feedbackHistory = [
    ...(currentPlan.feedbackHistory || []),
    {
      feedback: feedback,
      appliedAt: new Date().toISOString(),
      summaryOfChanges: /cardio/i.test(feedback) && /recovery/i.test(feedback)
        ? 'Added dedicated Zone 2 cardio sessions and transitioned Day 3 into an active mobility & recovery protocol.'
        : `Applied user modifications for "${feedback}".`,
    },
  ];
  res.json(updatedPlan);
});

// ----------------------------------------------------
// Frontend Mounting (Vite Dev Middleware or Static Dist)
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FitBuddy Server running at http://0.0.0.0:${PORT}`);
    console.log(`FastAPI-style Swagger Docs at http://0.0.0.0:${PORT}/docs`);
    console.log(`Health endpoint at http://0.0.0.0:${PORT}/api/health`);
  });
}

startServer();
