import Link from "next/link";
import type { ReactNode } from "react";

type IconName =
  | "arrow"
  | "spark"
  | "code"
  | "play"
  | "check"
  | "terminal"
  | "github"
  | "star";

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    arrow: <path d="M4 12h15m-6-6 6 6-6 6" />,
    spark: <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />,
    code: <><path d="m8 9-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" /></>,
    play: <path d="m9 7 7 5-7 5V7Z" fill="currentColor" stroke="none" />,
    check: <path d="m5 12 4 4L19 6" />,
    terminal: <><path d="m5 7 4 4-4 4M12 15h7" /><rect x="3" y="4" width="18" height="16" rx="2" /></>,
    github: <><path d="M12 3a9 9 0 0 0-2.85 17.54c.45.08.62-.2.62-.43v-1.7c-2.52.55-3.05-1.08-3.05-1.08-.4-1.03-1-1.3-1-1.3-.83-.56.06-.55.06-.55.92.06 1.4.94 1.4.94.82 1.4 2.14 1 2.66.77.08-.6.32-1 .58-1.23-2.02-.23-4.15-1-4.15-4.5 0-1 .36-1.8.94-2.43-.1-.23-.4-1.16.1-2.4 0 0 .77-.25 2.5.93A8.8 8.8 0 0 1 12 6.7c.78 0 1.55.1 2.28.3 1.74-1.18 2.5-.93 2.5-.93.5 1.24.2 2.17.1 2.4.6.63.94 1.43.94 2.43 0 3.5-2.13 4.27-4.16 4.5.33.28.62.8.62 1.62v2.4c0 .24.16.52.63.43A9 9 0 0 0 12 3Z" /></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" fill="currentColor" stroke="none" />,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function ButtonLink({ children, href = "/sign-up?fallback_redirect_url=/dashboard", variant = "primary" }: { children: ReactNode; href?: string; variant?: "primary" | "secondary" }) {
  return <Link href={href} className={`button button-${variant}`}>{children}<span className="button-icon"><Icon name="arrow" size={15} /></span></Link>;
}

const technologies = [
  ["AI", "ChatGPT · Claude · Gemini · Antigravity"],
  ["Frontend", "HTML · CSS · JavaScript · React · Next.js · Tailwind"],
  ["Backend", "Convex · APIs · Data modelling"],
  ["Identity", "Clerk · protected routes · user flows"],
  ["Ship", "Vercel · GitHub · production deployment"],
];

const curriculum = ["AI development workflow", "Prompt & context engineering", "React & component thinking", "Next.js & modern routing", "Tailwind CSS", "Authentication with Clerk", "Convex & real-time CRUD", "Gemini API", "GitHub, debugging & deployment"];

const schedule = [
  ["01", "Portfolio website", "A sharp personal site that puts your work in context."],
  ["02", "Business landing page", "Build a conversion-ready interface with an actual brief."],
  ["03", "Modern dashboard", "Model product data in a focused SaaS workspace."],
  ["04", "CRUD application", "Work with real-time data, forms, and useful states."],
  ["05", "AI application", "Design a practical workflow around the Gemini API."],
  ["06", "Mini SaaS", "Bring identity, data, and interactions together."],
  ["07", "Capstone", "Ship your most complete project with a portfolio story."],
];

const reviews = [
  ["Mira Nair", "BBA student", "I expected a course full of theory. Instead, I opened a blank editor on day one and had something I was proud to share by the weekend.", "MN"],
  ["Aditya Rao", "Freelance designer", "The AI workflow made the hard parts feel approachable. The mentor feedback helped me turn a good-looking build into one that actually works.", "AR"],
  ["Nikhil Thomas", "Career switcher", "Seven projects gave me more confidence than months of tutorial hopping. I finally understand how modern apps are put together.", "NT"],
];

import { getCourseDetails } from "@/lib/courses-service";
import CourseOfferHashScroller from "./_components/CourseOfferHashScroller";

export default async function BuildSoftwareWithAI() {
  const course = await getCourseDetails("build-software-with-ai");
  const price = course?.price ? `₹${course.price.toLocaleString("en-IN")}` : "₹999";

  return (
    <main>
      <CourseOfferHashScroller />
      <nav className="nav shell" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="VibeLogic Studio home"><span className="brand-mark"><Icon name="spark" size={15} /></span>VibeLogic<span>Studio</span></a>
        <div className="nav-links"><a href="#bootcamp">Bootcamp</a><a href="#curriculum">Curriculum</a><a href="#reviews">Stories</a></div>
        <Link href="/checkout?courseSlug=build-software-with-ai" className="nav-cta">Join the cohort <Icon name="arrow" size={14} /></Link>
      </nav>

      <section className="hero shell" id="top">
        <div className="hero-copy reveal">
          <p className="eyebrow"><span className="live-dot" /> July 2026 cohort · Limited seats</p>
          <h1>Build software<br /><em>with AI.</em></h1>
          <p className="hero-lede">Learn modern web development by shipping real projects with AI. No prior coding experience required.</p>
          <div className="hero-actions"><ButtonLink href="/checkout?courseSlug=build-software-with-ai">Enroll now</ButtonLink><ButtonLink href="#bootcamp" variant="secondary">Explore the bootcamp</ButtonLink></div>
          <div className="hero-proof"><div className="avatar-stack"><span>AN</span><span>RK</span><span>MS</span></div><p>Built for beginners who want<br />a real portfolio, not another playlist.</p></div>
        </div>
        <div className="hero-stage reveal delay-1" aria-label="Illustration of VibeLogic development workspace">
          <div className="stage-topline"><span>VIBEL0GIC / WORKSPACE</span><span className="status"><i /> Live build</span></div>
          <div className="code-window"><div className="window-bar"><span className="window-dots"><i /><i /><i /></span><span>app/page.tsx</span><span>•••</span></div><div className="code-content"><span><b>01</b> <i>import</i> <strong>{"{ build }"}</strong> <i>from</i> <mark>&quot;@vibelogic/ai&quot;</mark></span><span><b>02</b></span><span><b>03</b> <i>export default function</i> <strong>Launch</strong>() {'{'}</span><span><b>04</b> &nbsp; <i>return</i> <strong>(</strong></span><span><b>05</b> &nbsp;&nbsp; &lt;<mark>Project</mark> momentum=<mark>&quot;real&quot;</mark> /&gt;</span><span><b>06</b> &nbsp; <strong>)</strong></span><span><b>07</b> {'}'}</span></div></div>
          <div className="prompt-card"><div className="prompt-head"><span className="ai-symbol"><Icon name="spark" size={13} /></span><span>VibeLogic AI</span><small>now</small></div><p>Scaffolded your dashboard.<br /><strong>3 production patterns added.</strong></p><div className="prompt-progress"><i /><span>Context ready</span></div></div>
          <div className="commit-card"><span className="git-icon"><Icon name="github" size={16} /></span><div><strong>main</strong><small>deployed to production</small></div><span className="commit-check"><Icon name="check" size={12} /></span></div>
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
        </div>
      </section>

      <section className="metrics"><div className="shell metrics-grid">{[["7", "Days to build"], ["7", "Real-world projects"], ["14+", "Hours, live with mentors"], [price, "Launch offer"]].map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div></section>

      <section className="shell intro" id="about"><div className="intro-heading"><p className="eyebrow amber">Not another course platform</p><h2>Learn the way<br />software gets made.</h2></div><div className="intro-copy"><p>VibeLogic Studio is an AI-first learning space for people ready to make things on the web. You learn by framing a problem, building the interface, and shipping it.</p><div className="intro-points"><div><span>01</span><h3>AI-native from the start</h3><p>Use AI like a thoughtful development partner—not a shortcut you cannot explain.</p></div><div><span>02</span><h3>Projects over syntax</h3><p>Every lesson contributes to a useful, presentable product.</p></div><div><span>03</span><h3>Production habits</h3><p>Version control, deployment, debugging, and the decisions that make work hold up.</p></div></div></div></section>

      <section className="shell bootcamp-section scroll-mt-[100px]" id="course-offer"><div id="bootcamp" className="scroll-mt-[100px]" /><div className="section-heading"><div><p className="eyebrow amber">The flagship experience</p><h2>Become an AI developer<br />in just seven days.</h2></div><p>One focused, live cohort designed to turn curiosity into a working body of work.</p></div><div className="bootcamp-card"><div className="course-info"><div className="course-label">AI BUILD SPRINT · COHORT 01</div><h3>Build your first<br /><em>production-ready</em> web apps.</h3><div className="course-tags">{["Live classes", "7 projects", "Certificate", "Mentor support"].map(tag => <span key={tag}>{tag}</span>)}</div></div><div className="course-details"><div className="price"><small>Launch offer</small><strong>{price}</strong><span>one-time payment</span></div><ul>{["React, Next.js & Tailwind", "Convex + Clerk foundations", "AI-assisted development", "Deploy your work on Vercel"].map(item => <li key={item}><Icon name="check" size={16} />{item}</li>)}</ul><ButtonLink href="/checkout?courseSlug=build-software-with-ai">Enroll now</ButtonLink><p className="course-footnote">Starts July 27 · recordings included</p></div></div></section>

      <section className="shell courses"><div className="section-heading compact"><div><p className="eyebrow amber">What&apos;s next</p><h2>Keep building.</h2></div><p>Focused programs for the work you want to do next.</p></div><div className="course-grid">{[["01", "Modern React Development", "Component systems, states, and polished UI."], ["02", "Build SaaS Products", "Take a focused product from idea to payment."], ["03", "AI Automation", "Connect models to work that needs doing."], ["04", "Full Stack AI", "AI features, data, and deployment in one stack."]].map(([number, title, detail]) => <article className="coming-card" key={title}><span>{number}</span><div><h3>{title}</h3><p>{detail}</p></div><button disabled aria-disabled="true">Coming soon</button></article>)}</div></section>

      <section className="learn-section" id="curriculum"><div className="shell"><div className="learn-header"><p className="eyebrow amber">A practical curriculum</p><h2>Everything you need<br />to make the <em>first move.</em></h2><p>We do not pretend the tools stand still. You will learn a resilient workflow for learning, building, and figuring things out.</p></div><div className="curriculum-list">{curriculum.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p><Icon name="arrow" size={16} /></div>)}</div></div></section>

      <section className="shell projects"><div className="projects-sidebar"><p className="eyebrow amber">Seven days. Seven projects.</p><h2>Your week of <em>making.</em></h2><p>Each day has a distinct outcome. By the end, you will have proof of how you think, not just what you watched.</p><a href="#bootcamp" className="text-link">See the full bootcamp <Icon name="arrow" size={15} /></a></div><div className="timeline">{schedule.map(([day, title, detail]) => <article key={day}><span className="day-number">{day}</span><div><p>DAY {day}</p><h3>{title}</h3><span>{detail}</span></div><span className="timeline-point" /></article>)}</div></section>

      <section className="tech-section"><div className="shell"><div className="section-heading"><div><p className="eyebrow amber">Modern tools, taught in context</p><h2>A stack that<br />gets things <em>shipped.</em></h2></div><p>Learn the tools in the same flow that modern teams use to take an idea from blank file to live URL.</p></div><div className="tech-grid">{technologies.map(([title, tools], i) => <div className="tech-item" key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{tools}</p></div>)}</div></div></section>

      <section className="shell reviews" id="reviews"><div className="section-heading compact"><div><p className="eyebrow amber">From the studio</p><h2>Momentum is<br />contagious.</h2></div><p>Notes from people who stopped waiting to feel ready.</p></div><div className="review-grid">{reviews.map(([name, role, review, initials]) => <article className="review-card" key={name}><div className="whatsapp-bar"><span className="review-avatar">{initials}</span><div><strong>{name}</strong><small>{role} · AI Build Sprint</small></div><span className="message-time">9:41</span></div><div className="message"><div className="stars">{[1,2,3,4,5].map(n => <Icon key={n} name="star" size={12} />)}</div><p>{review}</p><small>Read after cohort 01 <Icon name="check" size={13} /></small></div></article>)}</div></section>

      <section className="shell faq"><div><p className="eyebrow amber">Questions, answered</p><h2>A clear way in.</h2><p>Still deciding? Start here. If you need a hand, we are easy to reach.</p></div><div className="faq-list">{[["Who is this bootcamp for?", "College students, beginners, non-CS learners, freelancers, founders, working professionals, and career switchers who want a modern, hands-on introduction to building software."], ["Do I need coding experience?", "No. We start from the practical fundamentals and give you a structured way to use AI as you build."], ["Will recordings be available?", "Yes. Every live session is recorded, so you can revisit the work and catch up when life gets busy."], ["Do I receive a certificate?", "Yes. Complete the full seven-day sprint and you will receive a VibeLogic Studio certificate."], ["How long is the bootcamp?", "Seven focused days, including 14+ hours of live instruction, build time, feedback, and project milestones."]].map(([question, answer], index) => <details key={question} open={index === 0}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>

      <section className="shell final-wrap"><div className="final-cta"><div className="final-glow" /><p className="eyebrow">THE NEXT COHORT IS OPEN</p><h2>Start building software<br />with <em>AI today.</em></h2><p>One week. Seven projects. A much clearer idea of what you can make.</p><ButtonLink href="/checkout?courseSlug=build-software-with-ai">Enroll now</ButtonLink><small>{price} launch offer · certificate included</small></div></section>


      <footer className="footer shell"><div><a className="brand" href="#top"><span className="brand-mark"><Icon name="spark" size={15} /></span>VibeLogic<span>Studio</span></a><p>Build what&apos;s next, one project at a time.</p></div><div className="footer-links"><div><strong>Explore</strong><a href="#bootcamp">Bootcamp</a><a href="#curriculum">Curriculum</a><a href="#reviews">Student stories</a></div><div><strong>Connect</strong><a href="mailto:hello@vibelogic.studio">hello@vibelogic.studio</a><a href="#top">Instagram</a><a href="#top">LinkedIn</a></div><div><strong>Legal</strong><a href="#top">Privacy policy</a><a href="#top">Terms of use</a></div></div><p className="copyright">© 2026 VibeLogic Studio. Built for curious people.</p></footer>
    </main>
  );
}
