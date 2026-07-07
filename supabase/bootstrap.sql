-- RepForge live-data bootstrap
-- Run after supabase/schema.sql.

insert into public.exercises (
  slug, name, muscle_group, target_muscle, secondary_muscles, equipment,
  movement_pattern, angle_focus, difficulty, joint_stress_level, fatigue_level,
  strength_score, hypertrophy_score, default_sets, default_reps_min,
  default_reps_max, default_rest_seconds, form_tips, common_mistakes
) values
  ('incline-db-press', 'Incline Dumbbell Press', 'Chest', 'Upper chest', array['Front delts','Triceps'], 'Dumbbells', 'Horizontal press', '30 degree incline', 'intermediate', 'moderate', 'high', 8, 9, 4, 6, 10, 150, 'Keep wrists stacked over elbows and lower under control.', 'Avoid an excessively steep bench angle.'),
  ('machine-chest-press', 'Machine Chest Press', 'Chest', 'Mid chest', array['Triceps'], 'Machine', 'Horizontal press', 'Stable mid-chest press', 'beginner', 'low', 'moderate', 6, 9, 3, 8, 12, 120, 'Set the seat so the handles align with mid chest.', 'Do not shorten the range to move more weight.'),
  ('low-high-cable-fly', 'Low-to-High Cable Fly', 'Chest', 'Upper chest', array[]::text[], 'Cable', 'Chest adduction', 'Low-to-high cable path', 'intermediate', 'low', 'low', 2, 9, 3, 10, 15, 75, 'Sweep the arms upward while keeping a soft elbow.', 'Do not turn the fly into a press.'),
  ('rope-pushdown', 'Rope Triceps Pushdown', 'Triceps', 'Lateral triceps', array[]::text[], 'Cable', 'Elbow extension', 'Shortened triceps', 'beginner', 'low', 'low', 4, 8, 3, 10, 15, 75, 'Keep elbows fixed and separate the rope at lockout.', 'Avoid using torso momentum.'),
  ('overhead-cable-extension', 'Overhead Cable Extension', 'Triceps', 'Long-head triceps', array[]::text[], 'Cable', 'Elbow extension', 'Loaded overhead stretch', 'intermediate', 'low', 'moderate', 4, 9, 3, 10, 14, 75, 'Let the triceps lengthen without moving the upper arm.', 'Do not flare the elbows excessively.'),
  ('wide-lat-pulldown', 'Wide-Grip Lat Pulldown', 'Back', 'Lats', array['Biceps','Upper back'], 'Cable', 'Vertical pull', 'Lat width', 'intermediate', 'moderate', 'moderate', 7, 8, 4, 6, 10, 135, 'Drive elbows down while keeping the chest tall.', 'Do not pull behind the neck.'),
  ('seated-cable-row', 'Seated Cable Row', 'Back', 'Mid back', array['Lats','Biceps'], 'Cable', 'Horizontal pull', 'Neutral-grip thickness', 'beginner', 'low', 'moderate', 6, 9, 4, 8, 12, 120, 'Reach under control, then pull elbows behind the torso.', 'Avoid excessive lower-back rocking.'),
  ('single-arm-db-row', 'Single-Arm Dumbbell Row', 'Back', 'Lats', array['Biceps'], 'Dumbbell', 'Horizontal pull', 'Unilateral lower lat', 'intermediate', 'moderate', 'moderate', 6, 8, 3, 8, 12, 90, 'Keep hips square and pull toward the back pocket.', 'Do not rotate the torso to finish the rep.'),
  ('reverse-pec-deck', 'Reverse Pec Deck', 'Shoulders', 'Rear delts', array['Upper back'], 'Machine', 'Horizontal abduction', 'Supported rear delt', 'beginner', 'low', 'low', 2, 8, 3, 12, 15, 60, 'Lead with the elbows and pause briefly.', 'Avoid shrugging the shoulders.'),
  ('ez-bar-curl', 'EZ-Bar Curl', 'Biceps', 'Biceps', array['Forearms'], 'EZ bar', 'Elbow flexion', 'Heavy mid-range curl', 'intermediate', 'moderate', 'moderate', 6, 8, 3, 8, 12, 90, 'Keep the upper arms quiet and control the lowering.', 'Avoid leaning back to start each rep.'),
  ('hammer-curl', 'Hammer Curl', 'Biceps', 'Brachialis', array['Forearms','Biceps'], 'Dumbbells', 'Neutral-grip curl', 'Arm thickness', 'beginner', 'low', 'low', 4, 8, 2, 10, 14, 75, 'Keep a neutral wrist through the full range.', 'Do not swing the dumbbells.'),
  ('seated-db-shoulder-press', 'Seated Dumbbell Shoulder Press', 'Shoulders', 'Front delts', array['Side delts','Triceps'], 'Dumbbells', 'Vertical press', 'Overhead strength', 'intermediate', 'moderate', 'high', 8, 8, 4, 6, 10, 150, 'Press with stacked wrists and a stable ribcage.', 'Avoid excessive lower-back extension.'),
  ('cable-lateral-raise', 'Cable Lateral Raise', 'Shoulders', 'Side delts', array[]::text[], 'Cable', 'Shoulder abduction', 'Constant-tension side delt', 'intermediate', 'low', 'low', 2, 10, 3, 12, 16, 60, 'Lead with the elbow and stop near shoulder height.', 'Do not shrug the weight upward.'),
  ('face-pull', 'Face Pull', 'Shoulders', 'Rear delts', array['Upper back','Rotator cuff'], 'Cable', 'Horizontal pull', 'External rotation', 'beginner', 'low', 'low', 2, 8, 3, 12, 16, 60, 'Pull toward eye level and rotate the hands apart.', 'Avoid turning it into a low row.'),
  ('dumbbell-shrug', 'Dumbbell Shrug', 'Traps', 'Upper traps', array[]::text[], 'Dumbbells', 'Scapular elevation', 'Trap thickness', 'beginner', 'low', 'moderate', 5, 8, 3, 10, 15, 75, 'Elevate straight up and pause without rolling.', 'Do not circle the shoulders.'),
  ('skull-crusher', 'EZ-Bar Skull Crusher', 'Triceps', 'Long-head triceps', array[]::text[], 'EZ bar', 'Elbow extension', 'Stretched triceps', 'intermediate', 'high', 'moderate', 5, 8, 3, 8, 12, 90, 'Lower behind the forehead while keeping upper arms stable.', 'Avoid letting elbows drift wide.'),
  ('incline-db-curl', 'Incline Dumbbell Curl', 'Biceps', 'Biceps long head', array[]::text[], 'Dumbbells', 'Elbow flexion', 'Lengthened biceps', 'intermediate', 'moderate', 'low', 3, 9, 3, 8, 12, 75, 'Keep shoulders behind the torso and supinate fully.', 'Do not bring elbows forward.'),
  ('flat-db-press', 'Flat Dumbbell Press', 'Chest', 'Mid chest', array['Triceps'], 'Dumbbells', 'Horizontal press', 'Flat press strength', 'intermediate', 'moderate', 'high', 8, 9, 4, 6, 10, 150, 'Keep shoulder blades set and forearms vertical.', 'Avoid bouncing out of the bottom.'),
  ('close-grip-pulldown', 'Close-Grip Lat Pulldown', 'Back', 'Lower lats', array['Biceps'], 'Cable', 'Vertical pull', 'Sagittal lower-lat pull', 'beginner', 'low', 'moderate', 6, 9, 4, 8, 12, 120, 'Pull elbows toward the hips.', 'Avoid leaning far behind the cable.'),
  ('incline-machine-press', 'Incline Machine Press', 'Chest', 'Upper chest', array['Triceps'], 'Machine', 'Horizontal press', 'Supported upper chest', 'beginner', 'low', 'moderate', 6, 9, 3, 8, 12, 105, 'Use a seat height that keeps elbows below shoulders.', 'Do not lock the shoulder blades forward.'),
  ('chest-supported-row', 'Chest-Supported Row', 'Back', 'Mid back', array['Rear delts','Lats'], 'Machine', 'Horizontal pull', 'Upper-back thickness', 'intermediate', 'low', 'moderate', 6, 9, 4, 8, 12, 120, 'Keep the chest on the pad and pause at contraction.', 'Avoid lifting the chest to finish reps.'),
  ('decline-db-press', 'Decline Dumbbell Press', 'Chest', 'Lower chest', array['Triceps'], 'Dumbbells', 'Horizontal press', 'Lower chest', 'intermediate', 'moderate', 'moderate', 6, 8, 3, 8, 12, 120, 'Use a controlled decline and stable shoulder blades.', 'Avoid an extreme decline angle.'),
  ('neutral-lat-pulldown', 'Neutral-Grip Lat Pulldown', 'Back', 'Lats', array['Biceps'], 'Cable', 'Vertical pull', 'Shoulder-friendly lat pull', 'beginner', 'low', 'moderate', 6, 9, 3, 10, 14, 105, 'Drive the elbows down through a comfortable path.', 'Avoid shortening the stretch at the top.'),
  ('machine-lateral-raise', 'Machine Lateral Raise', 'Shoulders', 'Side delts', array[]::text[], 'Machine', 'Shoulder abduction', 'Stable side-delt tension', 'beginner', 'low', 'low', 2, 10, 3, 12, 16, 60, 'Keep the torso still and control the bottom.', 'Avoid bouncing the machine arms.'),
  ('preacher-curl', 'Preacher Curl', 'Biceps', 'Biceps', array[]::text[], 'Machine', 'Elbow flexion', 'Strict shortened curl', 'beginner', 'moderate', 'low', 3, 9, 3, 10, 14, 75, 'Keep the upper arm supported throughout.', 'Do not hyperextend the elbow at the bottom.'),
  ('leg-press', 'Leg Press', 'Legs', 'Quads', array['Glutes'], 'Machine', 'Knee-dominant squat', 'Stable quad compound', 'beginner', 'moderate', 'high', 8, 9, 4, 8, 12, 150, 'Use a depth you can control without the pelvis rolling.', 'Do not lock the knees aggressively.'),
  ('romanian-deadlift', 'Romanian Deadlift', 'Legs', 'Hamstrings', array['Glutes','Spinal erectors'], 'Barbell', 'Hip hinge', 'Lengthened hamstrings', 'intermediate', 'high', 'high', 9, 9, 4, 6, 10, 150, 'Push hips back while keeping the bar close.', 'Avoid turning the movement into a squat.'),
  ('walking-lunge', 'Walking Lunge', 'Legs', 'Quads and glutes', array['Hamstrings'], 'Dumbbells', 'Single-leg squat', 'Unilateral stride', 'intermediate', 'moderate', 'high', 5, 9, 3, 8, 12, 105, 'Use a controlled stride and stable front foot.', 'Avoid pushing off the trailing foot.'),
  ('leg-extension', 'Leg Extension', 'Legs', 'Quads', array[]::text[], 'Machine', 'Knee extension', 'Shortened quads', 'beginner', 'moderate', 'low', 2, 9, 3, 12, 15, 75, 'Pause at the top without slamming the stack.', 'Avoid lifting the hips from the seat.'),
  ('seated-leg-curl', 'Seated Leg Curl', 'Legs', 'Hamstrings', array[]::text[], 'Machine', 'Knee flexion', 'Lengthened hamstrings', 'beginner', 'low', 'low', 2, 9, 3, 10, 15, 75, 'Keep the hips down and curl through full range.', 'Avoid rushing the eccentric.'),
  ('seated-calf-raise', 'Seated Calf Raise', 'Legs', 'Soleus', array['Calves'], 'Machine', 'Plantar flexion', 'Bent-knee calves', 'beginner', 'low', 'low', 3, 8, 3, 10, 15, 60, 'Pause in the stretch and at the top.', 'Avoid bouncing through the bottom.'),
  ('hanging-knee-raise', 'Hanging Knee Raise', 'Core', 'Abs', array['Hip flexors'], 'Bodyweight', 'Spinal flexion', 'Pelvic control', 'intermediate', 'low', 'moderate', 2, 8, 3, 10, 15, 45, 'Curl the pelvis upward instead of only lifting knees.', 'Avoid swinging the torso.'),
  ('cable-wood-chop', 'Cable Wood Chop', 'Core', 'Obliques', array['Abs'], 'Cable', 'Trunk rotation', 'Rotational control', 'intermediate', 'low', 'low', 2, 7, 2, 10, 14, 45, 'Rotate through the torso with controlled hips.', 'Avoid yanking the cable with the arms.')
on conflict (slug) do update set
  name = excluded.name,
  muscle_group = excluded.muscle_group,
  target_muscle = excluded.target_muscle,
  secondary_muscles = excluded.secondary_muscles,
  equipment = excluded.equipment,
  movement_pattern = excluded.movement_pattern,
  angle_focus = excluded.angle_focus,
  default_sets = excluded.default_sets,
  default_reps_min = excluded.default_reps_min,
  default_reps_max = excluded.default_reps_max,
  default_rest_seconds = excluded.default_rest_seconds,
  form_tips = excluded.form_tips,
  common_mistakes = excluded.common_mistakes;

insert into public.exercise_variants (
  exercise_id, variation_name, angle_focus, equipment, joint_stress_level
)
select e.id, v.variation_name, v.angle_focus, v.equipment, v.joint_stress
from (
  values
    ('incline-db-press', 'Incline Smith Press', 'Stable upper chest press', 'Smith machine', 'moderate'),
    ('incline-db-press', 'Incline Machine Press', 'Supported upper chest', 'Machine', 'low'),
    ('machine-chest-press', 'Flat Dumbbell Press', 'Free-weight mid chest', 'Dumbbells', 'moderate'),
    ('low-high-cable-fly', 'Pec Deck Fly', 'Supported mid chest', 'Machine', 'low'),
    ('low-high-cable-fly', 'High-to-Low Cable Fly', 'Lower chest cable path', 'Cable', 'low'),
    ('rope-pushdown', 'Straight-Bar Pushdown', 'Heavy shortened triceps', 'Cable', 'moderate'),
    ('overhead-cable-extension', 'Overhead Dumbbell Extension', 'Long-head triceps stretch', 'Dumbbell', 'moderate'),
    ('wide-lat-pulldown', 'Neutral-Grip Pulldown', 'Shoulder-friendly vertical pull', 'Cable', 'low'),
    ('wide-lat-pulldown', 'Assisted Pull-up', 'Body-control vertical pull', 'Machine', 'moderate'),
    ('seated-cable-row', 'Chest-Supported Row', 'Supported back thickness', 'Machine', 'low'),
    ('single-arm-db-row', 'Single-Arm Cable Row', 'Constant-tension unilateral row', 'Cable', 'low'),
    ('reverse-pec-deck', 'Face Pull', 'Rear delt external rotation', 'Cable', 'low'),
    ('ez-bar-curl', 'Cable Curl', 'Constant-tension biceps', 'Cable', 'low'),
    ('hammer-curl', 'Rope Hammer Curl', 'Cable neutral-grip curl', 'Cable', 'low'),
    ('seated-db-shoulder-press', 'Machine Shoulder Press', 'Supported overhead press', 'Machine', 'low'),
    ('cable-lateral-raise', 'Machine Lateral Raise', 'Stable side-delt tension', 'Machine', 'low'),
    ('face-pull', 'Reverse Pec Deck', 'Supported rear delt', 'Machine', 'low'),
    ('skull-crusher', 'Overhead Cable Extension', 'Cable long-head stretch', 'Cable', 'low'),
    ('flat-db-press', 'Machine Chest Press', 'Stable mid-chest press', 'Machine', 'low'),
    ('close-grip-pulldown', 'Neutral-Grip Pulldown', 'Shoulder-friendly lower lat', 'Cable', 'low'),
    ('leg-press', 'Hack Squat', 'Quad compound', 'Machine', 'high'),
    ('romanian-deadlift', 'Dumbbell RDL', 'Dumbbell hip hinge', 'Dumbbells', 'moderate'),
    ('walking-lunge', 'Reverse Lunge', 'Knee-friendly unilateral squat', 'Dumbbells', 'low'),
    ('leg-extension', 'Single-Leg Extension', 'Unilateral quads', 'Machine', 'low'),
    ('seated-leg-curl', 'Lying Leg Curl', 'Hamstring knee flexion', 'Machine', 'low'),
    ('hanging-knee-raise', 'Cable Crunch', 'Loaded spinal flexion', 'Cable', 'low')
) as v(slug, variation_name, angle_focus, equipment, joint_stress)
join public.exercises e on e.slug = v.slug
on conflict (exercise_id, variation_name) do update set
  angle_focus = excluded.angle_focus,
  equipment = excluded.equipment,
  joint_stress_level = excluded.joint_stress_level;

create or replace function public.add_default_plan_day(
  p_user_id uuid,
  p_day_of_week smallint,
  p_title text,
  p_muscle_groups text[],
  p_duration smallint,
  p_items jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_day_id uuid;
  v_slot_id uuid;
  v_exercise_id uuid;
  v_item jsonb;
begin
  insert into public.workout_days (
    user_id, day_of_week, title, muscle_groups, estimated_duration,
    sort_order, block_type, active
  ) values (
    p_user_id, p_day_of_week, p_title, p_muscle_groups, p_duration,
    p_day_of_week, 'hypertrophy', true
  ) returning id into v_day_id;

  for v_item in select value from jsonb_array_elements(p_items)
  loop
    select id into v_exercise_id
    from public.exercises
    where slug = v_item ->> 'slug';

    if v_exercise_id is null then
      raise exception 'Missing seeded exercise: %', v_item ->> 'slug';
    end if;

    insert into public.planned_exercise_slots (
      workout_day_id, slot_name, muscle_group, movement_pattern,
      angle_focus, priority, sets, reps_min, reps_max, rest_seconds, sort_order
    ) values (
      v_day_id,
      v_item ->> 'slot',
      v_item ->> 'muscle',
      v_item ->> 'movement',
      v_item ->> 'angle',
      v_item ->> 'priority',
      (v_item ->> 'sets')::smallint,
      (v_item ->> 'min')::smallint,
      (v_item ->> 'max')::smallint,
      (v_item ->> 'rest')::smallint,
      (v_item ->> 'order')::smallint
    ) returning id into v_slot_id;

    insert into public.workout_day_exercises (
      workout_day_id, slot_id, exercise_id, sort_order, sets,
      reps_min, reps_max, rest_seconds, notes
    ) values (
      v_day_id,
      v_slot_id,
      v_exercise_id,
      (v_item ->> 'order')::smallint,
      (v_item ->> 'sets')::smallint,
      (v_item ->> 'min')::smallint,
      (v_item ->> 'max')::smallint,
      (v_item ->> 'rest')::smallint,
      v_item ->> 'reason'
    );
  end loop;
end;
$$;

revoke all on function public.add_default_plan_day(uuid,smallint,text,text[],smallint,jsonb) from public;

create or replace function public.create_default_workout_plan()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_duration smallint;
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;

  select least(workout_duration_minutes, 90)
  into v_duration
  from public.profiles
  where id = v_user_id;
  v_duration := coalesce(v_duration, 90);

  delete from public.workout_days where user_id = v_user_id;

  perform public.add_default_plan_day(v_user_id, 1, 'Chest + Triceps', array['Chest','Triceps'], v_duration, '[
    {"order":1,"slug":"incline-db-press","slot":"Upper chest strength","muscle":"Chest","movement":"Horizontal press","angle":"Upper chest","priority":"main","sets":4,"min":6,"max":10,"rest":150,"reason":"Stable anchor lift for progressive overload."},
    {"order":2,"slug":"machine-chest-press","slot":"Mid chest press","muscle":"Chest","movement":"Horizontal press","angle":"Mid chest","priority":"accessory","sets":3,"min":8,"max":12,"rest":120,"reason":"Supported pressing after the anchor lift."},
    {"order":3,"slug":"low-high-cable-fly","slot":"Chest fly","muscle":"Chest","movement":"Chest adduction","angle":"Upper chest","priority":"isolation","sets":3,"min":10,"max":15,"rest":75,"reason":"Low-joint-stress angle coverage."},
    {"order":4,"slug":"rope-pushdown","slot":"Triceps pushdown","muscle":"Triceps","movement":"Elbow extension","angle":"Shortened","priority":"accessory","sets":3,"min":10,"max":15,"rest":75,"reason":"Direct lateral-head triceps work."},
    {"order":5,"slug":"overhead-cable-extension","slot":"Long-head triceps","muscle":"Triceps","movement":"Elbow extension","angle":"Lengthened","priority":"isolation","sets":3,"min":10,"max":14,"rest":75,"reason":"Complements pushdowns with an overhead stretch."}
  ]'::jsonb);

  perform public.add_default_plan_day(v_user_id, 2, 'Back + Biceps', array['Back','Biceps'], v_duration, '[
    {"order":1,"slug":"wide-lat-pulldown","slot":"Lat width","muscle":"Back","movement":"Vertical pull","angle":"Lat width","priority":"main","sets":4,"min":6,"max":10,"rest":135,"reason":"Stable vertical-pull strength marker."},
    {"order":2,"slug":"seated-cable-row","slot":"Back thickness","muscle":"Back","movement":"Horizontal pull","angle":"Mid back","priority":"main","sets":4,"min":8,"max":12,"rest":120,"reason":"Repeatable setup for weekly overload."},
    {"order":3,"slug":"single-arm-db-row","slot":"Unilateral row","muscle":"Back","movement":"Horizontal pull","angle":"Lower lat","priority":"accessory","sets":3,"min":8,"max":12,"rest":90,"reason":"Balances sides with unilateral work."},
    {"order":4,"slug":"reverse-pec-deck","slot":"Rear delts","muscle":"Shoulders","movement":"Horizontal abduction","angle":"Rear delt","priority":"isolation","sets":3,"min":12,"max":15,"rest":60,"reason":"Low-fatigue shoulder balance."},
    {"order":5,"slug":"ez-bar-curl","slot":"Heavy curl","muscle":"Biceps","movement":"Elbow flexion","angle":"Mid range","priority":"accessory","sets":3,"min":8,"max":12,"rest":90,"reason":"Direct biceps progression slot."},
    {"order":6,"slug":"hammer-curl","slot":"Neutral curl","muscle":"Biceps","movement":"Neutral-grip curl","angle":"Brachialis","priority":"isolation","sets":2,"min":10,"max":14,"rest":75,"reason":"Finishes arm thickness with a neutral grip."}
  ]'::jsonb);

  perform public.add_default_plan_day(v_user_id, 3, 'Shoulders + Arms', array['Shoulders','Biceps','Triceps'], v_duration, '[
    {"order":1,"slug":"seated-db-shoulder-press","slot":"Overhead press","muscle":"Shoulders","movement":"Vertical press","angle":"Front delts","priority":"main","sets":4,"min":6,"max":10,"rest":150,"reason":"Stable overhead strength marker."},
    {"order":2,"slug":"cable-lateral-raise","slot":"Side delts","muscle":"Shoulders","movement":"Shoulder abduction","angle":"Side delt","priority":"isolation","sets":3,"min":12,"max":16,"rest":60,"reason":"Constant-tension side-delt work."},
    {"order":3,"slug":"face-pull","slot":"Rear delts","muscle":"Shoulders","movement":"Horizontal pull","angle":"External rotation","priority":"isolation","sets":3,"min":12,"max":16,"rest":60,"reason":"Shoulder-friendly rear-delt balance."},
    {"order":4,"slug":"dumbbell-shrug","slot":"Traps","muscle":"Traps","movement":"Scapular elevation","angle":"Upper traps","priority":"accessory","sets":3,"min":10,"max":15,"rest":75,"reason":"Direct trap work without lower-back fatigue."},
    {"order":5,"slug":"skull-crusher","slot":"Triceps stretch","muscle":"Triceps","movement":"Elbow extension","angle":"Lengthened","priority":"accessory","sets":3,"min":8,"max":12,"rest":90,"reason":"Long-head triceps work away from chest day."},
    {"order":6,"slug":"incline-db-curl","slot":"Stretch curl","muscle":"Biceps","movement":"Elbow flexion","angle":"Lengthened","priority":"accessory","sets":3,"min":8,"max":12,"rest":75,"reason":"Lengthened biceps work complements heavy curls."}
  ]'::jsonb);

  perform public.add_default_plan_day(v_user_id, 4, 'Chest + Back', array['Chest','Back'], v_duration, '[
    {"order":1,"slug":"flat-db-press","slot":"Mid chest strength","muscle":"Chest","movement":"Horizontal press","angle":"Mid chest","priority":"main","sets":4,"min":6,"max":10,"rest":150,"reason":"Stable Thursday press for overload."},
    {"order":2,"slug":"close-grip-pulldown","slot":"Lower lats","muscle":"Back","movement":"Vertical pull","angle":"Lower lats","priority":"main","sets":4,"min":8,"max":12,"rest":120,"reason":"A different grip from the width-focused pull."},
    {"order":3,"slug":"incline-machine-press","slot":"Supported upper chest","muscle":"Chest","movement":"Horizontal press","angle":"Upper chest","priority":"accessory","sets":3,"min":8,"max":12,"rest":105,"reason":"Machine support manages fatigue."},
    {"order":4,"slug":"chest-supported-row","slot":"Upper-back thickness","muscle":"Back","movement":"Horizontal pull","angle":"Mid back","priority":"accessory","sets":4,"min":8,"max":12,"rest":120,"reason":"Protects the lower back before leg day."},
    {"order":5,"slug":"low-high-cable-fly","slot":"Chest fly","muscle":"Chest","movement":"Chest adduction","angle":"Upper chest","priority":"isolation","sets":3,"min":12,"max":15,"rest":75,"reason":"Adds stimulus without more pressing fatigue."},
    {"order":6,"slug":"face-pull","slot":"Upper-back balance","muscle":"Shoulders","movement":"Horizontal pull","angle":"Rear delt","priority":"isolation","sets":3,"min":12,"max":16,"rest":60,"reason":"Balances the session with low joint stress."}
  ]'::jsonb);

  perform public.add_default_plan_day(v_user_id, 5, 'Upper Body Hypertrophy', array['Chest','Back','Shoulders','Arms'], v_duration, '[
    {"order":1,"slug":"decline-db-press","slot":"Lower chest","muscle":"Chest","movement":"Horizontal press","angle":"Lower chest","priority":"accessory","sets":3,"min":8,"max":12,"rest":120,"reason":"Fresh chest angle at controlled volume."},
    {"order":2,"slug":"neutral-lat-pulldown","slot":"Lat volume","muscle":"Back","movement":"Vertical pull","angle":"Neutral grip","priority":"accessory","sets":3,"min":10,"max":14,"rest":105,"reason":"Shoulder-friendly weekly lat frequency."},
    {"order":3,"slug":"machine-chest-press","slot":"Chest volume","muscle":"Chest","movement":"Horizontal press","angle":"Mid chest","priority":"accessory","sets":3,"min":10,"max":14,"rest":90,"reason":"Stable near-failure hypertrophy work."},
    {"order":4,"slug":"seated-cable-row","slot":"Back volume","muscle":"Back","movement":"Horizontal pull","angle":"Mid back","priority":"accessory","sets":3,"min":10,"max":14,"rest":90,"reason":"Low-skill back volume late in the week."},
    {"order":5,"slug":"machine-lateral-raise","slot":"Side delts","muscle":"Shoulders","movement":"Shoulder abduction","angle":"Side delt","priority":"isolation","sets":3,"min":12,"max":16,"rest":60,"reason":"Stable side-delt pump work."},
    {"order":6,"slug":"preacher-curl","slot":"Strict curl","muscle":"Biceps","movement":"Elbow flexion","angle":"Shortened","priority":"isolation","sets":3,"min":10,"max":14,"rest":75,"reason":"Strict late-week biceps work."},
    {"order":7,"slug":"overhead-cable-extension","slot":"Long-head triceps","muscle":"Triceps","movement":"Elbow extension","angle":"Lengthened","priority":"isolation","sets":3,"min":10,"max":15,"rest":75,"reason":"Elbow-friendly final triceps exposure."}
  ]'::jsonb);

  perform public.add_default_plan_day(v_user_id, 6, 'Legs + Abs', array['Legs','Core'], v_duration, '[
    {"order":1,"slug":"leg-press","slot":"Quad compound","muscle":"Legs","movement":"Knee-dominant squat","angle":"Quads","priority":"main","sets":4,"min":8,"max":12,"rest":150,"reason":"Stable lower-body anchor."},
    {"order":2,"slug":"romanian-deadlift","slot":"Hamstring hinge","muscle":"Legs","movement":"Hip hinge","angle":"Lengthened hamstrings","priority":"main","sets":4,"min":6,"max":10,"rest":150,"reason":"Stable hinge for progressive overload."},
    {"order":3,"slug":"walking-lunge","slot":"Single-leg movement","muscle":"Legs","movement":"Single-leg squat","angle":"Quads and glutes","priority":"accessory","sets":3,"min":8,"max":12,"rest":105,"reason":"Unilateral balance and glute work."},
    {"order":4,"slug":"leg-extension","slot":"Quad isolation","muscle":"Legs","movement":"Knee extension","angle":"Shortened quads","priority":"isolation","sets":3,"min":12,"max":15,"rest":75,"reason":"Direct shortened-position quad work."},
    {"order":5,"slug":"seated-leg-curl","slot":"Hamstring curl","muscle":"Legs","movement":"Knee flexion","angle":"Lengthened hamstrings","priority":"isolation","sets":3,"min":10,"max":15,"rest":75,"reason":"Complements the hip-hinge pattern."},
    {"order":6,"slug":"seated-calf-raise","slot":"Calves","muscle":"Legs","movement":"Plantar flexion","angle":"Bent knee","priority":"isolation","sets":3,"min":10,"max":15,"rest":60,"reason":"Dedicated soleus volume."},
    {"order":7,"slug":"hanging-knee-raise","slot":"Dynamic abs","muscle":"Core","movement":"Spinal flexion","angle":"Lower abs","priority":"isolation","sets":3,"min":10,"max":15,"rest":45,"reason":"Controlled dynamic core work."},
    {"order":8,"slug":"cable-wood-chop","slot":"Rotational core","muscle":"Core","movement":"Trunk rotation","angle":"Obliques","priority":"isolation","sets":2,"min":10,"max":14,"rest":45,"reason":"Rotational control inside the session cap."}
  ]'::jsonb);
end;
$$;

grant execute on function public.create_default_workout_plan() to authenticated;

create or replace function public.finish_workout_session(p_session_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Authentication required';
  end if;
  if not exists (
    select 1 from public.workout_sessions
    where id = p_session_id and user_id = v_user_id
  ) then
    raise exception 'Workout session not found';
  end if;

  update public.workout_sessions
  set
    status = 'completed',
    completed_at = now(),
    duration_minutes = greatest(
      1,
      round(extract(epoch from (now() - started_at)) / 60)::smallint
    )
  where id = p_session_id and user_id = v_user_id;

  insert into public.personal_records (
    user_id, exercise_id, workout_set_id, record_type,
    weight, reps, estimated_1rm, achieved_at
  )
  select
    v_user_id,
    best.exercise_id,
    best.id,
    'estimated_1rm',
    best.weight,
    best.reps,
    round((best.weight * (1 + best.reps::numeric / 30)), 2),
    now()
  from (
    select distinct on (ws.exercise_id)
      ws.id, ws.exercise_id, ws.weight, ws.reps
    from public.workout_sets ws
    where ws.session_id = p_session_id and ws.completed = true
    order by ws.exercise_id, (ws.weight * (1 + ws.reps::numeric / 30)) desc
  ) best
  where not exists (
    select 1
    from public.personal_records pr
    where pr.user_id = v_user_id
      and pr.exercise_id = best.exercise_id
      and coalesce(pr.estimated_1rm, 0) >=
        round((best.weight * (1 + best.reps::numeric / 30)), 2)
  );
end;
$$;

grant execute on function public.finish_workout_session(uuid) to authenticated;

drop policy if exists "Recommendations can be inserted by owner" on public.ai_recommendations;
create policy "Recommendations can be inserted by owner"
  on public.ai_recommendations for insert
  with check (auth.uid() = user_id);

drop policy if exists "Recommendations can be updated by owner" on public.ai_recommendations;
create policy "Recommendations can be updated by owner"
  on public.ai_recommendations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Usage logs can be inserted by owner" on public.ai_usage_logs;
create policy "Usage logs can be inserted by owner"
  on public.ai_usage_logs for insert
  with check (auth.uid() = user_id);
