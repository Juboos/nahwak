// ─── Shared primitives ────────────────────────────────────────────────────────

export type WordRole = 'فعل' | 'فاعل' | 'مفعول به' | null

// ─── LiveSwap ─────────────────────────────────────────────────────────────────

export interface LiveSwapWord {
  root: string
  ending: string
  role: WordRole
}

export interface LiveSwapState {
  endings: string[]
  /** Per-word role overrides for this state. Defaults to words[i].role when absent. */
  roles?: WordRole[]
  /** May contain <strong> tags */
  explanation: string
}

export interface LiveSwapBlock {
  type: 'live-swap'
  words: LiveSwapWord[]
  states: LiveSwapState[]
}

// ─── QuestionFirst ────────────────────────────────────────────────────────────

export interface FollowUpQuestion {
  question: string
  options: string[]
  correctIndex: number
  wrongExplanation: string
  correctExplanation: string
  /** Per-option explanations; falls back to wrongExplanation / correctExplanation */
  optionExplanations?: string[]
}

export interface QuestionItem {
  text: string
  options: string[]
  correctIndex: number
  wrongExplanation: string
  correctFollowUp?: FollowUpQuestion
  /** Shown after correct with no follow-up */
  correctExplanation?: string
  /** Per-option explanations; falls back to wrongExplanation / correctExplanation */
  optionExplanations?: string[]
}

export interface QuestionFirstBlock {
  type: 'question-first'
  id?: string
  exercise?: boolean
  tip?: string
  example: string
  questions: QuestionItem[]
}

// ─── VisualAnatomy ────────────────────────────────────────────────────────────

export interface AnatomyWord {
  text: string
  role: string
  explanation: string
  color: string
  colorDim: string
}

export interface VisualAnatomyBlock {
  type: 'visual-anatomy'
  words: AnatomyWord[]
  hint?: string
}

// ─── Basic content blocks (handled by ContentRenderer) ────────────────────────

export interface TextBlock {
  type: 'text'
  id?: string
  content: string
  style?: 'heading-1' | 'heading-2' | 'quote' | 'note' | 'rule'
}

export interface ExampleBlock {
  type: 'example'
  id?: string
  arabic?: string
  breakdown?: string
  note?: string
  noteLines?: string[]
  centered?: boolean
}

export interface TableBlock {
  type: 'table'
  id?: string
  headers?: string[]
  rows?: string[][]
}

export interface CardBlock {
  type: 'card'
  id?: string
  title?: string
  content: string
}

export interface AudioBlock {
  type: 'audio'
  id?: string
  src?: string
  label?: string
}

export interface DividerBlock {
  type: 'divider'
  id?: string
}

// ─── WordClassifier ───────────────────────────────────────────────────────────

export interface WordClassifierItem {
  word: string
  type: 'اسم' | 'فعل ماضٍ' | 'فعل مضارع' | 'فعل أمر' | 'حرف'
  sign: string
}

export interface WordClassifierBlock {
  type: 'word-classifier'
  id?: string
  exercise?: boolean
  title?: string
  words: WordClassifierItem[]
}

// ─── HtmlBlock ────────────────────────────────────────────────────────────────

export interface HtmlBlock {
  type: 'html'
  id?: string
  content: string
}

// ─── ReviewPrompt ─────────────────────────────────────────────────────────────

export interface ReviewPromptBlock {
  type: 'review-prompt'
  id?: string
  question: string
  answer: string
}

// ─── SignsExplorer ────────────────────────────────────────────────────────────

export interface SignExample {
  pre: string
  sign: string
  post: string
  meaning?: string
}

export interface SignTab {
  label: string
  examples: SignExample[]
}

export interface SignsExplorerBlock {
  type: 'signs-explorer'
  id?: string
  tabs: SignTab[]
  hint?: string
}

// ─── SentenceClassifier ───────────────────────────────────────────────────────

export type GrammarWordType = 'اسم' | 'فعل ماضٍ' | 'فعل مضارع' | 'فعل أمر' | 'حرف'

export interface ClassifierWord {
  text: string
  type: GrammarWordType
  reason: string
}

export interface ClassifierSentence {
  arabic: string
  words: ClassifierWord[]
}

export interface SentenceClassifierBlock {
  type: 'sentence-classifier'
  id?: string
  exercise?: boolean
  instructions?: string
  sentences: ClassifierSentence[]
}

// ─── SignQuiz ─────────────────────────────────────────────────────────────────

export interface SignQuizItem {
  word: string
  correctOptions: string[]
  reason: string
}

export interface SignQuizBlock {
  type: 'sign-quiz'
  id?: string
  exercise?: boolean
  title?: string
  options: string[]
  items: SignQuizItem[]
  multiSelect?: boolean
}

// ─── SentenceTypeClassifier (اسمية / فعلية) ──────────────────────────────────

export type SentenceType = 'اسمية' | 'فعلية'

export interface TypedSentence {
  /** Words of the sentence, in order (RTL). The first word decides the type. */
  words: string[]
  type: SentenceType
  /** Explanation shown after the learner answers. */
  reason: string
}

export interface SentenceTypeClassifierBlock {
  type: 'sentence-type-classifier'
  id?: string
  exercise?: boolean
  instructions?: string
  sentences: TypedSentence[]
}

// ─── RoleTagger (المبتدأ والخبر / الفعل والفاعل) ──────────────────────────────

export interface TagTarget {
  /** The role label the learner must locate, e.g. 'المبتدأ' or 'الفعل'. */
  role: string
  /** Index (in words[]) of the correct word for this role. */
  wordIndex: number
  /** Short note revealed once the learner taps the right word. */
  hint?: string
}

export interface RoleTaggerItem {
  words: string[]
  /** Sentence kind, shown as a badge to frame the task. */
  kind: SentenceType
  /** Roles to identify, asked one after another. */
  targets: TagTarget[]
}

export interface RoleTaggerBlock {
  type: 'role-tagger'
  id?: string
  exercise?: boolean
  instructions?: string
  items: RoleTaggerItem[]
}

// ─── Union ────────────────────────────────────────────────────────────────────

export type BlockData =
  | LiveSwapBlock
  | QuestionFirstBlock
  | VisualAnatomyBlock
  | WordClassifierBlock
  | HtmlBlock
  | ReviewPromptBlock
  | SignsExplorerBlock
  | SentenceClassifierBlock
  | SignQuizBlock
  | SentenceTypeClassifierBlock
  | RoleTaggerBlock
  | TextBlock
  | ExampleBlock
  | TableBlock
  | CardBlock
  | AudioBlock
  | DividerBlock

// ─── Lesson & course data ─────────────────────────────────────────────────────

export interface LessonMeta {
  unitNum: number
  lessonNum: number
  title: string
  duration: string
  objectives: string[]
  sources: string[]
}

export interface LessonData {
  meta: LessonMeta
  blocks: BlockData[]
}

export interface UnitMeta {
  id: number
  label: string
  title: string
  available: boolean
  lessonCount: number
}

export interface CourseMeta {
  id: string
  slug: string
  title: string
  subtitle: string
  level: 'مبتدئ' | 'متوسط' | 'متقدم'
  sources: string[]
  units: UnitMeta[]
}
