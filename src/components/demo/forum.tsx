'use client'

/**
 * The forum.
 *
 * The articles are editorial content in the CMS; the conversation underneath
 * them is member-generated and lives in the demonstration store, so a comment
 * posted here appears immediately in the browser that posted it. "Signing in" is
 * the simulated members' portal session — the same session the portal, the
 * directory and the dues pages use.
 */
import Link from 'next/link'
import { useState } from 'react'

import { useDemo } from '@/lib/demo/store'
import type { ForumComment } from '@/lib/demo/types'

import { FormFeedback } from './form-field'
import { Avatar, Badge } from './ui'

export interface ForumListItem {
  slug: string
  title: string
  excerpt: string
  author: string
  authorRole: string
  category: string
  date: string
  imageUrl: string | null
}

function formatDate(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function CommentForm({
  threadSlug,
  commentId,
  onDone,
  label,
}: {
  threadSlug: string
  commentId?: string
  onDone?: () => void
  label: string
}) {
  const { addForumComment, addForumReply, currentMember } = useDemo()
  const [body, setBody] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const fieldId = `comment-${commentId ?? 'new'}`

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (body.trim().length < 3) {
      setError('Write at least a few words so the thread is useful to others.')
      setMessage(null)
      return
    }

    setError(null)

    if (commentId) {
      addForumReply(threadSlug, commentId, body)
      setMessage('Your reply has been added to this demonstration thread.')
    } else {
      addForumComment(threadSlug, body)
      setMessage('Your comment has been added to this demonstration thread.')
    }

    setBody('')
    onDone?.()
  }

  return (
    <form className="forum-form" onSubmit={handleSubmit}>
      <label htmlFor={fieldId}>
        <span>{label}</span>
      </label>

      <textarea
        id={fieldId}
        name="comment"
        rows={commentId ? 3 : 5}
        value={body}
        onChange={(event) => {
          setBody(event.target.value)
          setError(null)
        }}
        placeholder="Share what you think, or ask a question."
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${fieldId}-error` : undefined}
      />

      {error ? (
        <p id={`${fieldId}-error`} className="field-error">
          {error}
        </p>
      ) : null}

      <div className="forum-form-actions">
        <button type="submit" className="btn primary">
          {commentId ? 'Post reply' : 'Post comment'}
        </button>

        {onDone ? (
          <button type="button" className="btn text" onClick={onDone}>
            Cancel
          </button>
        ) : null}
      </div>

      <p className="form-hint">
        Posting as {currentMember?.name ?? 'member'} — this demonstration stores the comment in
        this browser only.
      </p>

      <FormFeedback message={message} />
    </form>
  )
}

/**
 * The forum index: the published articles, with the size of each discussion.
 */
export function ForumIndex({ items }: { items: ForumListItem[] }) {
  const { commentsForThread } = useDemo()

  return (
    <div className="forum-list">
      {items.map((item) => {
        const comments = commentsForThread(item.slug)
        const replies = comments.reduce((sum, comment) => sum + comment.replies.length, 0)
        const count = comments.length + replies

        return (
          <article key={item.slug} className="forum-card">
            {item.imageUrl ? (
              <div className="forum-card-image">
                {/* eslint-disable-next-line @next/next/no-img-element -- the image is a plain prototype or CMS URL, not an optimised asset */}
                <img src={item.imageUrl} alt="" width={640} height={400} loading="lazy" decoding="async" />
              </div>
            ) : null}

            <div className="forum-card-body">
              <p className="forum-card-meta">
                <span className="forum-category">{item.category}</span>
                <span>{formatDate(item.date)}</span>
              </p>

              <h3>
                <Link href={`/knowledge/forum/${item.slug}`}>{item.title}</Link>
              </h3>

              <p className="forum-card-excerpt">{item.excerpt}</p>

              <p className="forum-byline">
                <b>{item.author}</b>
                {item.authorRole ? <span>{item.authorRole}</span> : null}
              </p>
            </div>

            <p className="forum-card-count">
              <b>{count}</b>
              <span>{count === 1 ? 'comment' : 'comments'}</span>
            </p>
          </article>
        )
      })}
    </div>
  )
}

/**
 * The discussion under an article: comments, replies, and the forms that add
 * them. Only a signed-in member can take part.
 */
export function ForumDiscussion({ threadSlug }: { threadSlug: string }) {
  const { commentsForThread, currentMember, memberById, session } = useDemo()
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  const comments = commentsForThread(threadSlug)
  const replyCount = comments.reduce((sum, comment) => sum + comment.replies.length, 0)

  return (
    <section className="forum-discussion" aria-labelledby="discussion-heading">
      <div className="forum-discussion-head">
        <div>
          <span className="eyebrow">Discussion</span>
          <h2 id="discussion-heading">
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            {replyCount > 0 ? ` · ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}` : ''}
          </h2>
        </div>

        <Badge tone="gold">Members only</Badge>
      </div>

      {comments.length === 0 ? (
        <p className="state-message">
          No one has commented on this article yet. Start the conversation below.
        </p>
      ) : (
        <ol className="forum-comments">
          {comments.map((comment: ForumComment) => {
            const authorName = memberById(comment.authorId)?.name ?? 'A member'

            return (
              <li key={comment.id} className="forum-comment">
                <div className="forum-comment-main">
                  <Avatar name={authorName} />

                  <div>
                    <p className="forum-meta">
                      <b>{authorName}</b>
                      <span>{formatDate(comment.date)}</span>
                    </p>
                    <p className="forum-body">{comment.body}</p>

                    {session ? (
                      <button
                        type="button"
                        className="forum-reply-toggle"
                        onClick={() =>
                          setReplyingTo((current) => (current === comment.id ? null : comment.id))
                        }
                        aria-expanded={replyingTo === comment.id}
                      >
                        {replyingTo === comment.id ? 'Cancel reply' : 'Reply'}
                      </button>
                    ) : null}
                  </div>
                </div>

                {replyingTo === comment.id && session ? (
                  <CommentForm
                    threadSlug={threadSlug}
                    commentId={comment.id}
                    label="Your reply"
                    onDone={() => setReplyingTo(null)}
                  />
                ) : null}

                {comment.replies.length > 0 ? (
                  <ul className="forum-replies">
                    {comment.replies.map((reply) => {
                      const replyName = memberById(reply.authorId)?.name ?? 'A member'

                      return (
                        <li key={reply.id} className="forum-reply">
                          <Avatar name={replyName} />
                          <div>
                            <p className="forum-meta">
                              <b>{replyName}</b>
                              <span>{formatDate(reply.date)}</span>
                            </p>
                            <p className="forum-body">{reply.body}</p>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                ) : null}
              </li>
            )
          })}
        </ol>
      )}

      {session && currentMember ? (
        <CommentForm threadSlug={threadSlug} label="Add to the discussion" />
      ) : (
        <div className="forum-signin">
          <p>
            Only signed-in members can comment and reply. Sign in with a demonstration member to
            join the conversation.
          </p>
          <Link href="/portal/login" className="btn primary">
            Sign in to comment
          </Link>
        </div>
      )}
    </section>
  )
}
