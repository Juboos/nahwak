/* ── Default HTML content for shipped lessons ────────────── */
const DEFAULT_HTML_CONTENT = {
  '0-1': `<style>
  :root { --arabic-font: 'Noto Naskh Arabic', 'Scheherazade New', serif; }
  .lesson { direction: rtl; font-family: var(--arabic-font), var(--font-sans); padding: 1.5rem 0; max-width: 680px; }
  .lesson-card { background: var(--color-background-secondary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1.25rem 1.5rem; margin-bottom: 2rem; }
  .card-title { font-size: 13px; font-weight: 500; color: var(--color-text-secondary); margin-bottom: 1rem; text-transform: uppercase; letter-spacing: 0.05em; }
  .card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .card-item { display: flex; flex-direction: column; gap: 3px; }
  .card-item-label { font-size: 12px; color: var(--color-text-tertiary); }
  .card-item-value { font-size: 14px; color: var(--color-text-primary); font-weight: 500; line-height: 1.5; }
  .goal-box { background: var(--color-background-primary); border: 0.5px solid var(--color-border-secondary); border-radius: var(--border-radius-md); padding: 0.75rem 1rem; margin-top: 1rem; }
  .goal-box .card-item-label { font-size: 12px; color: var(--color-text-tertiary); margin-bottom: 4px; }
  .goal-box .card-item-value { font-size: 14px; }
  .terms-row { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 0.5rem; }
  .term-pill { background: var(--color-background-primary); border: 0.5px solid var(--color-border-secondary); border-radius: 20px; font-size: 13px; color: var(--color-text-secondary); padding: 3px 10px; }
  .section { margin-bottom: 2.5rem; }
  .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; padding-bottom: 0.6rem; border-bottom: 0.5px solid var(--color-border-tertiary); }
  .section-num { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 500; flex-shrink: 0; }
  .section-title { font-size: 18px; font-weight: 500; color: var(--color-text-primary); }
  .s1 .section-num { background: #EEEDFE; color: #3C3489; }
  .s2 .section-num { background: #E1F5EE; color: #085041; }
  .s3 .section-num { background: #FAEEDA; color: #633806; }
  .s4 .section-num { background: #E6F1FB; color: #0C447C; }
  .s5 .section-num { background: #EAF3DE; color: #27500A; }
  .prose { font-size: 16px; line-height: 1.9; color: var(--color-text-primary); }
  .prose p { margin-bottom: 1rem; }
  .analogy-box { background: var(--color-background-secondary); border-right: 3px solid #7F77DD; border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0; padding: 0.85rem 1rem; margin: 1rem 0; font-size: 15px; line-height: 1.8; color: var(--color-text-primary); }
  .model-box { background: var(--color-background-primary); border: 0.5px solid var(--color-border-secondary); border-radius: var(--border-radius-lg); padding: 1.25rem 1.5rem; margin-top: 1rem; }
  .model-step { display: flex; gap: 14px; margin-bottom: 1.1rem; align-items: flex-start; }
  .step-num { width: 26px; height: 26px; border-radius: 50%; background: #FAEEDA; color: #633806; font-size: 13px; font-weight: 500; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
  .step-text { font-size: 15px; line-height: 1.8; color: var(--color-text-primary); }
  .step-text strong { font-weight: 500; }
  .exercise { background: var(--color-background-primary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1.25rem 1.5rem; margin-bottom: 1.25rem; }
  .ex-header { display: flex; align-items: center; gap: 8px; margin-bottom: 0.75rem; }
  .ex-badge { font-size: 11px; font-weight: 500; padding: 3px 10px; border-radius: 20px; }
  .ex-easy { background: #EAF3DE; color: #27500A; }
  .ex-med { background: #FAEEDA; color: #633806; }
  .ex-hard { background: #FAECE7; color: #712B13; }
  .ex-q { font-size: 15px; font-weight: 500; color: var(--color-text-primary); margin-bottom: 0.75rem; line-height: 1.7; }
  .ex-options { display: flex; flex-direction: column; gap: 6px; margin-bottom: 1rem; }
  .ex-option { font-size: 14px; color: var(--color-text-secondary); line-height: 1.6; padding: 4px 0; }
  .answer-block { background: var(--color-background-secondary); border-radius: var(--border-radius-md); padding: 0.75rem 1rem; margin-top: 0.75rem; }
  .answer-label { font-size: 12px; color: var(--color-text-tertiary); margin-bottom: 4px; }
  .answer-text { font-size: 14px; color: var(--color-text-primary); line-height: 1.7; }
  .mistake-label { font-size: 12px; color: #993C1D; margin-top: 8px; margin-bottom: 3px; font-weight: 500; }
  .mistake-text { font-size: 13px; color: var(--color-text-secondary); line-height: 1.6; }
  .recall-box { background: var(--color-background-secondary); border: 0.5px solid var(--color-border-tertiary); border-radius: var(--border-radius-lg); padding: 1.25rem 1.5rem; }
  .recall-q { font-size: 15px; color: var(--color-text-primary); line-height: 1.8; padding: 0.6rem 0; border-bottom: 0.5px solid var(--color-border-tertiary); display: flex; gap: 10px; }
  .recall-q:last-child { border-bottom: none; }
  .recall-num { color: var(--color-text-tertiary); font-weight: 500; min-width: 20px; }
  .highlight { font-weight: 500; }
  .fill-blank { display: inline-block; border-bottom: 1.5px solid var(--color-border-primary); min-width: 80px; text-align: center; color: var(--color-text-tertiary); font-size: 14px; margin: 0 3px; }
  @media (max-width: 480px) { .card-grid { grid-template-columns: 1fr; } }
</style>

<div class="lesson" dir="rtl">

  <!-- LESSON CARD -->
  <div class="lesson-card">
    <div class="card-title">بطاقة الدرس</div>
    <div class="card-grid">
      <div class="card-item">
        <span class="card-item-label">الموضوع</span>
        <span class="card-item-value">ما هو النحو وما أهميته؟</span>
      </div>
      <div class="card-item">
        <span class="card-item-label">نوع الدورة</span>
        <span class="card-item-value">لغة عربية — النحو المستوى الأول</span>
      </div>
      <div class="card-item">
        <span class="card-item-label">المتعلم</span>
        <span class="card-item-value">ناطق بالعربية، مبتدئ في دراسة النحو</span>
      </div>
      <div class="card-item">
        <span class="card-item-label">نوع المعرفة</span>
        <span class="card-item-value">مفاهيم + حقائق</span>
      </div>
      <div class="card-item">
        <span class="card-item-label">المصادر</span>
        <span class="card-item-value">الآجرومية · النحو الصغير (العيوني)</span>
      </div>
      <div class="card-item">
        <span class="card-item-label">وقت القراءة التقديري</span>
        <span class="card-item-value">١٥ – ٢٠ دقيقة</span>
      </div>
    </div>
    <div class="goal-box">
      <div class="card-item-label">هدف الدرس</div>
      <div class="card-item-value">بنهاية الدرس، يستطيع المتعلم أن يشرح ما يدرسه علم النحو، وأن يذكر السبب الذي يجعل الناس بحاجة إلى تعلّمه.</div>
    </div>
    <div style="margin-top:1rem;">
      <div class="card-item-label" style="margin-bottom:6px;">المصطلحات الأساسية</div>
      <div class="terms-row">
        <span class="term-pill">النحو</span>
        <span class="term-pill">الكلمة</span>
        <span class="term-pill">الكلام</span>
        <span class="term-pill">الإعراب</span>
        <span class="term-pill">اللحن</span>
      </div>
    </div>
  </div>

  <!-- SECTION 1: HOOK -->
  <div class="section s1">
    <div class="section-header">
      <div class="section-num">١</div>
      <div class="section-title">التمهيد — لماذا يهمّك هذا؟</div>
    </div>
    <div class="prose">
      <p>تخيّل أنك تقرأ جملة: «أكلَ الأسدَ الرجلُ» — من الذي أكل هنا، الرجلُ أم الأسدُ؟ في اللغة العربية، حركةٌ واحدة على آخر الكلمة تجعل المعنى ينقلب كليًّا. ولهذا السبب بالتحديد، لم يكن النحو ترفًا للعلماء، بل كان ضرورةً لكل من يريد أن يفهم ما يقرأ ويُفهَم حين يتكلم.</p>
    </div>
  </div>

  <!-- SECTION 2: INPUT -->
  <div class="section s2">
    <div class="section-header">
      <div class="section-num">٢</div>
      <div class="section-title">الشرح — الفكرة الأساسية</div>
    </div>
    <div class="prose">
      <p>النحو هو العلم الذي يدرس <span class="highlight">الكلمةَ</span> و<span class="highlight">الكلامَ</span> معًا. أما الكلمة فيدرس النحو أنواعها وأحكامها: ما الذي يجعلها اسمًا، أو فعلًا، أو حرفًا؟ وما الذي يتغيّر في آخرها وما الذي يبقى ثابتًا؟ وأما الكلام — أي الجملة التي نصوغها من تلك الكلمات — فيدرس النحو بناءها: ما الجملة الفعلية؟ وما الجملة الاسمية؟ وكيف تتكامل أجزاؤها؟</p>
      <p>يمكن تلخيص ذلك في عبارة واحدة جاءت في النحو الصغير: «النحوُ يدرسُ أحكامَ الكلمةِ وأحكامَ الكلامِ». وهذان القسمان هما عمود الكتاب كله.</p>
    </div>
    <div class="analogy-box">
      <strong>تشبيه يقرّب الفكرة:</strong> تخيّل أن اللغة مبنى. الكلماتُ هي الطوبُ والحجارة، والنحوُ هو معرفةُ كيف تصف كلَّ حجرٍ وكيف تبني به الجدرانَ والأسقفَ. بدون هذه المعرفة قد تضع حجرًا في غير مكانه، فينهار البناء كله.
    </div>
    <div class="prose">
      <p>فلماذا يحتاج الناس إلى تعلّمه؟ لأن اللغة العربية تعتمد على ما يُسمّى <span class="highlight">الإعراب</span>، أي تغيير آخر الكلمة بحسب موقعها في الجملة. ومن يجهل هذا الإعراب وقع في ما يسمّيه العلماء <span class="highlight">اللحن</span>، وهو الخطأ في الكلام أو الكتابة. واللحن لم يكن قديمًا مجرد عيبٍ أسلوبي؛ كان يؤدي إلى سوء فهم النصوص وتغيير معانيها. لذلك وضع العلماء علم النحو ليكون حارسًا للغة وصونًا لمعانيها.</p>
    </div>
  </div>

  <!-- SECTION 3: MODEL -->
  <div class="section s3">
    <div class="section-header">
      <div class="section-num">٣</div>
      <div class="section-title">المثال المشروح</div>
    </div>
    <div class="prose">
      <p>لنرَ كيف يُفيدنا النحو في فهم جملة واحدة. خذ هذا المثال:</p>
      <p style="text-align:center; font-size:20px; font-weight:500; margin:1rem 0; letter-spacing:0.02em;">«ضَرَبَ زيدٌ عمرًا»</p>
    </div>
    <div class="model-box">
      <div class="model-step">
        <div class="step-num">أ</div>
        <div class="step-text"><strong>ما نوع كل كلمة؟</strong> «ضَرَبَ» فعلٌ، يدل على الحدث. «زيدٌ» و«عمرًا» اسمان، يدلان على أشخاص. هذا هو جزء الكلمة في النحو: تعرّف على نوع كل كلمة أولًا.</div>
      </div>
      <div class="model-step">
        <div class="step-num">ب</div>
        <div class="step-text"><strong>من فعل ومن وقع عليه الفعل؟</strong> هنا يأتي دور الحركات. «زيدٌ» آخره ضمّة — وهذا يعني أنه الفاعل، أي الذي ضرب. «عمرًا» آخره فتحة — وهذا يعني أنه المفعول به، أي الذي وُقع عليه الضرب.</div>
      </div>
      <div class="model-step">
        <div class="step-num">ج</div>
        <div class="step-text"><strong>ماذا لو تبدّلت الحركات؟</strong> لو قلنا «ضَرَبَ زيدًا عمرٌ» — صار عمرٌ هو الضارب، وزيدٌ هو المضروب. المعنى انقلب تمامًا، والكلمات نفسها لم تتغير، فقط تغيّرت حركة آخر كل اسم.</div>
      </div>
      <div class="model-step" style="margin-bottom:0;">
        <div class="step-num">د</div>
        <div class="step-text"><strong>ما الذي يعلّمنا إياه هذا؟</strong> النحوُ هو الذي يعطيك مفتاح قراءة هذه الحركات وفهم معناها. وهذا هو بالضبط ما سندرسه في هذه الدورة خطوةً خطوة.</div>
      </div>
    </div>
  </div>

  <!-- SECTION 4: PRACTICE -->
  <div class="section s4">
    <div class="section-header">
      <div class="section-num">٤</div>
      <div class="section-title">التدريبات</div>
    </div>

    <div class="exercise">
      <div class="ex-header">
        <span class="ex-badge ex-easy">سهل — تعرّف</span>
      </div>
      <div class="ex-q">لماذا وضع العلماء علم النحو؟ اختر الإجابة الصحيحة:</div>
      <div class="ex-options">
        <div class="ex-option">أ) لأن العرب أرادوا تعليم الأجانب اللغة العربية</div>
        <div class="ex-option">ب) لصون اللغة من الأخطاء وحفظ معاني النصوص من التحريف</div>
        <div class="ex-option">ج) لأن اللغة العربية كانت تُكتب بدون حركات قديمًا</div>
        <div class="ex-option">د) لأن العرب احتاجوا إلى ترجمة النصوص الأجنبية</div>
      </div>
      <div class="answer-block">
        <div class="answer-label">الإجابة الصحيحة</div>
        <div class="answer-text">ب) لصون اللغة من الأخطاء وحفظ معاني النصوص من التحريف — لأن اللحن (الخطأ في الإعراب) كان يؤدي إلى تغيير معاني النصوص، فجاء النحو ليضع أحكامًا واضحة تحول دون ذلك.</div>
        <div class="mistake-label">الخطأ الشائع</div>
        <div class="mistake-text">يميل بعض الطلاب إلى اختيار (أ) لأن الذهن يربط تعليم اللغة بالأجانب، لكن النحو وُضع أصلًا لحماية العرب أنفسهم من الوقوع في الخطأ.</div>
      </div>
    </div>

    <div class="exercise">
      <div class="ex-header">
        <span class="ex-badge ex-med">متوسط — تطبيق</span>
      </div>
      <div class="ex-q">أكمل العبارة الآتية المأخوذة من النحو الصغير بوضع الكلمتين المناسبتين في الفراغين:</div>
      <div style="background: var(--color-background-secondary); border-radius: var(--border-radius-md); padding: 1rem 1.25rem; margin-bottom: 1rem; font-size: 16px; line-height: 2.2; text-align: center; color: var(--color-text-primary);">
        «النَّحْوُ يَدْرُسُ أَحْكَامَ <span class="fill-blank">_______</span> وَأَحْكَامَ <span class="fill-blank">_______</span>»
      </div>
      <div class="answer-block">
        <div class="answer-label">الإجابة</div>
        <div class="answer-text">«النَّحْوُ يَدْرُسُ أَحْكَامَ <strong>الكَلِمَةِ</strong> وَأَحْكَامَ <strong>الكَلَامِ</strong>» — الكلمةُ هي الوحدة المفردة، والكلامُ هو الجملة المركّبة منها. وكلاهما محور هذا العلم.</div>
        <div class="mistake-label">الخطأ الشائع</div>
        <div class="mistake-text">يضع بعض الطلاب «الإعراب» بدلًا من «الكلام»، والإعراب في الحقيقة جزء مما يُدرَس داخل النحو، لا موضوعه الكلي.</div>
      </div>
    </div>

    <div class="exercise">
      <div class="ex-header">
        <span class="ex-badge ex-hard">صعب — تأمّل وتوظيف</span>
      </div>
      <div class="ex-q">بناءً على ما تعلّمته في هذا الدرس: لماذا نحتاج إلى دراسة علم النحو؟ اكتب إجابتك بأسلوبك الخاص في ثلاثة أسطر على الأكثر.</div>
      <div class="answer-block">
        <div class="answer-label">إجابة نموذجية</div>
        <div class="answer-text">نحتاج إلى دراسة النحو لأن اللغة العربية تعتمد على الإعراب — أي حركات أواخر الكلمات — لتحديد المعنى. فتغيير حركة واحدة قد يقلب معنى الجملة كليًّا، كما في «ضَرَبَ زيدٌ عمرًا» و«ضَرَبَ زيدًا عمرٌ». ومن يجهل هذه الأحكام قد يقرأ النصوص على غير وجهها الصحيح دون أن يدري.</div>
        <div class="mistake-label">الخطأ الشائع</div>
        <div class="mistake-text">الاكتفاء بجملة مبهمة كـ«لأن النحو مهم للغة» دون أي تفصيل أو مثال. الإجابة الجيدة تربط الفكرة بما درسه المتعلم فعلًا في الدرس.</div>
      </div>
    </div>
  </div>

  <!-- SECTION 5: RECALL -->
  <div class="section s5">
    <div class="section-header">
      <div class="section-num">٥</div>
      <div class="section-title">أسئلة الاسترجاع — للدرس القادم</div>
    </div>
    <p style="font-size:14px; color:var(--color-text-secondary); margin-bottom:1rem; line-height:1.7;">تُطرح هذه الأسئلة في بداية الدرس التالي، بدون كتب أو ملاحظات.</p>
    <div class="recall-box">
      <div class="recall-q">
        <span class="recall-num">١</span>
        <span>ما الذي يدرسه علم النحو؟ اذكر القسمين الرئيسيّين.</span>
      </div>
      <div class="recall-q">
        <span class="recall-num">٢</span>
        <span>لماذا احتاج العلماء إلى وضع علم النحو؟ وما الذي يحدث حين يجهل المرء أحكامه؟</span>
      </div>
    </div>
  </div>

</div>`,
}

/* ── Lesson content blocks ───────────────────────────────── */
export function getLessonContent(key) {
  try {
    const stored = JSON.parse(localStorage.getItem('nw_lesson_content') || '{}')[key]
    if (stored && stored.length > 0) return stored
    if (DEFAULT_HTML_CONTENT[key]) return [{ id: 'html-default', type: 'html', content: DEFAULT_HTML_CONTENT[key] }]
    return []
  } catch { return [] }
}
export function saveLessonContent(key, blocks) {
  try {
    const all = JSON.parse(localStorage.getItem('nw_lesson_content') || '{}')
    all[key] = blocks
    localStorage.setItem('nw_lesson_content', JSON.stringify(all))
  } catch { /* ignore persistence errors */ }
}

/* ── Course curriculum (units + lessons) ─────────────────── */
export function loadCourseCurriculum(courseId, defaults) {
  try {
    const all = JSON.parse(localStorage.getItem('nw_curriculum') || '{}')
    return all[courseId] ?? defaults
  } catch { return defaults }
}
export function saveCourseCurriculum(courseId, units) {
  try {
    const all = JSON.parse(localStorage.getItem('nw_curriculum') || '{}')
    all[courseId] = units
    localStorage.setItem('nw_curriculum', JSON.stringify(all))
  } catch { /* ignore persistence errors */ }
}

/*
 * Lesson key helper — course-aware.
 * Course 1 keeps the old format for backward compat.
 */
export function lessonStorageKey(courseId, unitId, lessonN) {
  return courseId === 'arabic-grammar-1' ? `${unitId}-${lessonN}` : `${courseId}:${unitId}-${lessonN}`
}
