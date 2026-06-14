import { useState } from 'react'
import { toAr } from '../utils/arabic'

const TYPE_META = {
  mcq:          { label: 'اختيار من متعدد', color: '#8B1A1A' },
  'fill-blank': { label: 'أكمل الفراغ',     color: '#C4841A' },
  'word-arrange':{ label: 'رتّب الجملة',     color: '#9C8068' },
}

function Feedback({ correct, wrongText, explanation }) {
  return (
    <div style={{
      marginTop: 12, padding: '10px 14px', borderRadius: 8,
      background: correct ? 'var(--saffron-dim)' : 'var(--maroon-dim)',
      border: `1px solid ${correct ? 'var(--saffron)' : 'var(--maroon)'}`,
    }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: correct ? 'var(--saffron)' : 'var(--maroon)', marginBottom: explanation ? 4 : 0 }}>
        {correct ? '✓ إجابة صحيحة!' : (wrongText ? `✗ الإجابة الصحيحة: ${wrongText}` : '✗ إجابة خاطئة')}
      </div>
      {explanation && <div style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.7 }}>{explanation}</div>}
    </div>
  )
}

function McqBlock({ ex }) {
  const [sel, setSel] = useState(null)
  const [done, setDone] = useState(false)

  return (
    <div>
      <p style={{ fontSize: '0.95rem', color: 'var(--ink)', marginBottom: 14, lineHeight: 1.75, fontFamily: 'var(--font-disp)' }}>
        {ex.question}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
        {(ex.options || []).map((opt, i) => {
          const isCorrect = i === ex.correctIndex
          const isSel = i === sel
          let border = 'var(--border-med)', bg = 'transparent', color = 'var(--ink)'
          if (done) {
            if (isCorrect) { border = 'var(--saffron)'; bg = 'var(--saffron-dim)'; color = 'var(--saffron)' }
            else if (isSel) { border = 'var(--maroon)'; bg = 'var(--maroon-dim)'; color = 'var(--maroon)' }
          } else if (isSel) { border = 'var(--maroon)'; bg = 'var(--maroon-dim)'; color = 'var(--maroon)' }
          return (
            <button key={i} onClick={() => !done && setSel(i)} style={{
              textAlign: 'right', padding: '9px 14px', borderRadius: 8,
              border: `1.5px solid ${border}`, background: bg, color,
              cursor: done ? 'default' : 'pointer',
              fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.5,
              transition: 'all 0.15s',
            }}>
              {opt}
            </button>
          )
        })}
      </div>
      {!done && sel !== null && (
        <button onClick={() => setDone(true)} className="btn btn-primary" style={{ fontSize: 13, padding: '7px 18px' }}>تحقق</button>
      )}
      {done && <Feedback correct={sel === ex.correctIndex} explanation={ex.explanation} />}
    </div>
  )
}

function FillBlankBlock({ ex }) {
  const [val, setVal] = useState('')
  const [done, setDone] = useState(false)
  const parts = (ex.sentence || '').split('___')
  const correct = val.trim() === (ex.answer || '').trim()

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 4, fontSize: '1rem', lineHeight: 2.4, marginBottom: 14, fontFamily: 'var(--font-disp)' }}>
        <span>{parts[0]}</span>
        <input
          type="text" value={val}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && val.trim() && !done) setDone(true) }}
          disabled={done}
          placeholder="…"
          style={{
            padding: '3px 10px', borderRadius: 6, width: 120, direction: 'rtl',
            border: `1.5px solid ${done ? (correct ? 'var(--saffron)' : 'var(--maroon)') : 'var(--border-med)'}`,
            background: done ? (correct ? 'var(--saffron-dim)' : 'var(--maroon-dim)') : 'var(--bg)',
            textAlign: 'center', fontFamily: 'var(--font-disp)', fontSize: '0.95rem', outline: 'none',
          }}
        />
        {parts[1] && <span>{parts[1]}</span>}
      </div>
      {!done && val.trim() && (
        <button onClick={() => setDone(true)} className="btn btn-primary" style={{ fontSize: 13, padding: '7px 18px' }}>تحقق</button>
      )}
      {done && <Feedback correct={correct} wrongText={!correct ? ex.answer : ''} explanation={ex.explanation} />}
    </div>
  )
}

function WordArrangeBlock({ ex }) {
  const words = ex.words || []
  const [placed, setPlaced] = useState([])
  const [done, setDone] = useState(false)
  const correct = done && placed.map(i => words[i]).join(' ') === (ex.correctSentence || '')

  function addWord(i) { if (!done) setPlaced(p => [...p, i]) }
  function removeWord(pos) { if (!done) setPlaced(p => p.filter((_, j) => j !== pos)) }

  return (
    <div>
      {/* Answer zone */}
      <div style={{
        minHeight: 46, border: '1.5px dashed var(--border-med)', borderRadius: 8,
        padding: '6px 10px', marginBottom: 10,
        display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center',
        background: 'var(--surface)',
      }}>
        {placed.length === 0
          ? <span style={{ fontSize: 12, color: 'var(--warm)' }}>انقر على الكلمات أدناه لترتيبها هنا</span>
          : placed.map((wi, pos) => (
            <button key={pos} onClick={() => removeWord(pos)} style={{
              padding: '4px 12px', borderRadius: 20, fontSize: '0.9rem',
              background: done ? (correct ? 'var(--saffron-dim)' : 'var(--maroon-dim)') : 'var(--card)',
              border: `1.5px solid ${done ? (correct ? 'var(--saffron)' : 'var(--maroon)') : 'var(--border-med)'}`,
              cursor: done ? 'default' : 'pointer',
              color: done ? (correct ? 'var(--saffron)' : 'var(--maroon)') : 'var(--ink)',
              fontFamily: 'var(--font-disp)',
            }}>{words[wi]}</button>
          ))
        }
      </div>

      {/* Word bank */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
        {words.map((w, i) => !placed.includes(i) && (
          <button key={i} onClick={() => addWord(i)} className="chip-bank" style={{ fontFamily: 'var(--font-disp)', fontSize: '0.9rem' }}>
            {w}
          </button>
        ))}
      </div>

      {!done && placed.length === words.length && words.length > 0 && (
        <button onClick={() => setDone(true)} className="btn btn-primary" style={{ fontSize: 13, padding: '7px 18px' }}>تحقق</button>
      )}
      {done && <Feedback correct={correct} wrongText={!correct ? ex.correctSentence : ''} explanation={ex.explanation} />}
    </div>
  )
}

export default function ExerciseBlock({ exercise, index }) {
  const meta = TYPE_META[exercise.type] || { label: exercise.type, color: 'var(--warm)' }
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border-med)',
      borderRadius: 12, padding: '20px 22px', marginBottom: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{
          width: 26, height: 26, background: 'var(--maroon)', color: 'var(--bg)',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, flexShrink: 0, fontFamily: 'var(--font-disp)',
        }}>{toAr(index + 1)}</span>
        <span style={{
          fontSize: 11, fontWeight: 700, color: meta.color,
          background: `${meta.color}18`, border: `1px solid ${meta.color}40`,
          padding: '2px 9px', borderRadius: 20,
        }}>{meta.label}</span>
      </div>
      {exercise.type === 'mcq' && <McqBlock ex={exercise} />}
      {exercise.type === 'fill-blank' && <FillBlankBlock ex={exercise} />}
      {exercise.type === 'word-arrange' && <WordArrangeBlock ex={exercise} />}
    </div>
  )
}
