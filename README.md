# Vainateyar Dual-Mode Portfolio

A Next.js 14 personal researcher website where the same domain serves two experiences:

- Public portfolio for visitors
- Password-protected admin editor for composing and publishing content

## Stack

- Next.js 14 App Router
- Supabase Postgres + Auth
- Tailwind CSS
- Tiptap
- `@hello-pangea/dnd`
- Vercel

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. In Supabase SQL editor, run [sql/supabase-setup.sql](/Users/vainateya_rangaraju/Documents/Personal_Website/sql/supabase-setup.sql).
4. Create your single admin user in Supabase Auth using email + password.
5. Install dependencies with `npm install`.
6. Start the app with `npm run dev`.

## Routes

- `/` home
- `/writing`
- `/writing/[slug]`
- `/talks`
- `/now`
- `/connect`
- `/login`
- `/admin`

## Notes

- Public pages render only `is_public = true` blocks.
- Admin sees draft + public blocks together and can reorder, edit, publish, or delete.
- Publishing triggers Next.js revalidation for the relevant public page.
- `public/cv.pdf` is currently a placeholder PDF and should be replaced with your real CV.
