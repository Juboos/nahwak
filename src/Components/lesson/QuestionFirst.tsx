import { useState } from 'react'
import type { QuestionItem, FollowUpQuestion } from '../../types/lesson'

export interface QuestionFirstProps {
  tip?: string
  example: string
  questions: QuestionItem[]
}

interface QState {
  mainSel: number | null
  mainEverCorrect: boolean
  followSel: number | null
  followEverCorrect: boolean
}

const fresh = (): QState => ({ mainSel: null, mainEverCorrect: false, followSel: null, followEverCorrect: false })

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getExplanation(
  i: number,
  correctIndex: number,
  optionExplanations: string[] | undefined,
  wrongExplanation: string,
  correctExplanation: string | undefined,
): string {
  if (optionExplanations?.[i]) return optionExplanations[i]
  if (i === correctIndex) return correctExplanation ?? ''
  return wrongExplanation
}

function optionBtnStyle(
  i: number,
  sel: number | null,
  correctIdx: number,
): React.CSSProperties {
  const base: React.CSSProperties = {
    fontSize: '.9rem',
    fontWeight: 500,
    padding: '.5rem 1.1rem',
    borderRadius: 8,
    border: '1px solid var(--border-med)',
    background: 'var(--bg)',
    cursor: 'pointer',
    fontFamily: 'var(--font-body)',
    transition: 'all 150ms',
    color: 'var(--ink-soft)',
    flex: '1 1 0',
  }
  if (sel === null) return base
  if (i === correctIdx) {
    return {
      ...base,
      background: 'rgba(45,106,79,0.13)',
      border: '1px solid rgba(45,106,79,.35)',
      color: '#2D6A4F',
      fontWeight: 700,
    }
  }
  return {
    ...base,
    background: 'rgba(139,26,26,0.09)',
    border: '1px solid rgba(139,26,26,.25)',
    color: 'var(--maroon)',
    fontWeight: 600,
  }
}

function explanationStyle(isCorrect: boolean): React.CSSProperties {
  return isCorrect
    ? {
        background: 'rgba(45,106,79,0.09)',
        border: '1px solid rgba(45,106,79,.22)',
        color: '#2D6A4F',
        fontSize: '.85rem',
        lineHeight: 1.75,
        padding: '.5rem .85rem',
        borderRadius: 7,
        textAlign: 'right',
      }
    : {
        background: 'rgba(139,26,26,0.08)',
        border: '1px solid rgba(139,26,26,.18)',
        color: 'var(--maroon)',
        fontSize: '.85rem',
        lineHeight: 1.75,
        padding: '.5rem .85rem',
        borderRadius: 7,
        textAlign: 'right',
      }
}

const RESET_BTN: React.CSSProperties = {
  background: 'transparent',
  border: '1px solid var(--border-med)',
  color: 'var(--ink-soft)',
  fontSize: '.8rem',
  padding: '.35rem 1rem',
  borderRadius: 6,
  cursor: 'pointer',
  fontFamily: 'var(--font-body)',
  transition: 'border-color 150ms, color 150ms',
}

// ─── QuestionBlock ────────────────────────────────────────────────────────────

function QuestionBlock({
  questionText,
  options,
  correctIndex,
  wrongExplanation,
  correctExplanation,
  optionExplanations,
  sel,
  onPick,
}: {
  questionText: string
  options: string[]
  correctIndex: number
  wrongExplanation: string
  correctExplanation?: string
  optionExplanations?: string[]
  sel: number | null
  onPick: (i: number) => void
}) {
  const expl = sel !== null
    ? getExplanation(sel, correctIndex, optionExplanations, wrongExplanation, correctExplanation)
    : null
  const isCorrect = sel !== null && sel === correctIndex

  return (
    <div style={{ width: '100%' }}>
      {/* Question text — right-aligned */}
      <div style={{
        fontSize: '.95rem',
        fontWeight: 600,
        color: 'var(--ink)',
        marginBottom: '.85rem',
        lineHeight: 1.6,
        textAlign: 'right',
      }}>
        {questionText}
      </div>

      {/* Options side by side — centered */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '.6rem', flexWrap: 'wrap', marginBottom: expl ? '.75rem' : 0 }}>
        {options.map((opt, i) => (
          <button
            key={i}
            style={optionBtnStyle(i, sel, correctIndex)}
            onClick={() => onPick(i)}
            onMouseEnter={e => {
              if (sel !== null) return
              e.currentTarget.style.background = 'rgba(139,26,26,0.07)'
              e.currentTarget.style.borderColor = 'rgba(139,26,26,.25)'
              e.currentTarget.style.color = 'var(--maroon)'
            }}
            onMouseLeave={e => {
              if (sel !== null) return
              e.currentTarget.style.background = 'var(--bg)'
              e.currentTarget.style.borderColor = 'var(--border-med)'
              e.currentTarget.style.color = 'var(--ink-soft)'
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Single explanation box — updates on each click */}
      {expl && (
        <div style={explanationStyle(isCorrect)} dangerouslySetInnerHTML={{ __html: expl }} />
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function QuestionFirst({ tip, example, questions }: QuestionFirstProps) {
  const [s, setS] = useState<QState>(fresh)

  const q: QuestionItem = questions[0]
  const fu: FollowUpQuestion | undefined = q.correctFollowUp

  const mainAnswered = s.mainSel !== null

  return (
    <div dir="rtl" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }}>

      {/* Tip — right-aligned */}
      {tip && (
        <div style={{ width: '100%', textAlign: 'right' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '.3rem',
            background: 'var(--saffron-dim)',
            border: '1px solid rgba(196,132,26,.28)',
            color: '#7A5010',
            fontSize: '.72rem', fontWeight: 600,
            padding: '.22rem .65rem', borderRadius: 4,
          }}>
            {tip}
          </span>
        </div>
      )}

      {/* Example sentence — centered */}
      <div style={{
        fontFamily: 'var(--font-disp)',
        fontSize: 'clamp(1.5rem, 4vw, 1.9rem)',
        fontWeight: 700,
        color: 'var(--ink)',
        textAlign: 'center',
        lineHeight: 1.4,
      }}>
        {example}
      </div>

      {/* Main question */}
      <QuestionBlock
        questionText={q.text}
        options={q.options}
        correctIndex={q.correctIndex}
        wrongExplanation={q.wrongExplanation}
        correctExplanation={q.correctExplanation}
        optionExplanations={q.optionExplanations}
        sel={s.mainSel}
        onPick={i => setS(prev => ({
          ...prev,
          mainSel: i,
          mainEverCorrect: prev.mainEverCorrect || i === q.correctIndex,
        }))}
      />

      {/* Follow-up — shown only after main was answered correctly at least once */}
      {s.mainEverCorrect && fu && (
        <div style={{ width: '100%', borderTop: '1px dashed var(--border)', paddingTop: '1rem' }}>
          <QuestionBlock
            questionText={fu.question}
            options={fu.options}
            correctIndex={fu.correctIndex}
            wrongExplanation={fu.wrongExplanation}
            correctExplanation={fu.correctExplanation}
            optionExplanations={fu.optionExplanations}
            sel={s.followSel}
            onPick={i => setS(prev => ({
              ...prev,
              followSel: i,
              followEverCorrect: prev.followEverCorrect || i === fu.correctIndex,
            }))}
          />

          {/* Mastery badge — stays once earned */}
          {s.followEverCorrect && (
            <div style={{
              marginTop: '1rem',
              background: 'rgba(45,106,79,0.11)',
              border: '1px solid rgba(45,106,79,.25)',
              color: '#2D6A4F',
              borderRadius: 9,
              padding: '.7rem 1.2rem',
              fontSize: '.875rem',
              fontWeight: 700,
              textAlign: 'center',
            }}>
              ✓ أتقنت هذا المثال
            </div>
          )}
        </div>
      )}

      {/* Reset — shown after any interaction */}
      {mainAnswered && (
        <button
          style={RESET_BTN}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--maroon)'; e.currentTarget.style.color = 'var(--maroon)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-med)'; e.currentTarget.style.color = 'var(--ink-soft)' }}
          onClick={() => setS(fresh())}
        >
          إعادة من البداية
        </button>
      )}
    </div>
  )
}

export default QuestionFirst
