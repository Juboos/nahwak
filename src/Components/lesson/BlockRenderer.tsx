import ContentRenderer from '../../Components/ContentRenderer'
import { LiveSwap } from './LiveSwap'
import { QuestionFirst } from './QuestionFirst'
import { VisualAnatomy } from './VisualAnatomy'
import { WordClassifier } from './WordClassifier'
import { ReviewPrompt } from './ReviewPrompt'
import { SignsExplorer } from './SignsExplorer'
import { SentenceClassifier } from './SentenceClassifier'
import { SignQuiz } from './SignQuiz'
import { SentenceTypeClassifier } from './SentenceTypeClassifier'
import { RoleTagger } from './RoleTagger'
import type { BlockData } from '../../types/lesson'

// ─── Single block ─────────────────────────────────────────────────────────────

export interface BlockRendererProps {
  block: BlockData
}

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'live-swap':
      return <LiveSwap words={block.words} states={block.states} />

    case 'question-first':
      return (
        <QuestionFirst
          tip={block.tip}
          example={block.example}
          questions={block.questions}
        />
      )

    case 'visual-anatomy':
      return <VisualAnatomy words={block.words} hint={block.hint} />

    case 'word-classifier':
      return <WordClassifier title={block.title} words={block.words} />

    case 'review-prompt':
      return <ReviewPrompt question={block.question} answer={block.answer} />

    case 'signs-explorer':
      return <SignsExplorer tabs={block.tabs} hint={block.hint} />

    case 'sentence-classifier':
      return <SentenceClassifier instructions={block.instructions} sentences={block.sentences} />

    case 'sign-quiz':
      return <SignQuiz title={block.title} options={block.options} items={block.items} multiSelect={block.multiSelect} />

    case 'sentence-type-classifier':
      return <SentenceTypeClassifier instructions={block.instructions} sentences={block.sentences} />

    case 'role-tagger':
      return <RoleTagger instructions={block.instructions} items={block.items} />

    default:
      // Delegate all legacy block types to the existing ContentRenderer
      return (
        <ContentRenderer
          blocks={[{ ...block, id: (block as { id?: string }).id ?? `block-${block.type}` }]}
        />
      )
  }
}

// ─── Ordered block list ───────────────────────────────────────────────────────

export interface LessonBlockListProps {
  blocks: BlockData[]
}

export function LessonBlockList({ blocks }: LessonBlockListProps) {
  return (
    <div dir="rtl">
      {blocks.map((block, i) => (
        <BlockRenderer
          key={(block as { id?: string }).id ?? i}
          block={block}
        />
      ))}
    </div>
  )
}

export default BlockRenderer
