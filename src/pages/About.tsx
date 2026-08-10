import React, { useState } from 'react';
import './About.css';

const TIMELINE_DATA = [
  { date: '7 MAY 2026', title: 'Registration Begins', desc: 'Applications open — start your HH Goa journey.', status: 'RUNNING' },
  { date: 'AUGUST 2026', title: 'Open Trials', desc: 'Skill-based challenges open to everyone.', status: 'RUNNING' },
  { date: 'EARLY SEPT 2026', title: 'Alpha Selections', desc: 'First shortlist from Open Trials performance.', status: 'RUNNING' },
  { date: 'EARLY SEPT 2026', title: 'Beta Selections', desc: 'Deeper technical & portfolio review.', status: 'TO BE STARTED' },
  { date: 'MID SEPT 2026', title: 'Charlie Selections', desc: 'Interviews and team-fit assessment.', status: 'TO BE STARTED' },
  { date: 'MID SEPT 2026', title: 'Delta Selections', desc: 'Final shortlist confirmed before partner matching.', status: 'TO BE STARTED' },
  { date: 'SEPTEMBER 2026', title: 'Partner Trials', desc: 'Selection based on each partner\'s requirements and interests.', status: 'TO BE STARTED' },
  { date: 'LATE SEPTEMBER', title: 'RSVP & Stake', desc: 'Final confirmation of your team\'s participation.', status: 'TO BE STARTED' },
  { date: '1 OCTOBER 2026', title: 'Registration Ends', desc: 'Last day to register — no new entries accepted after this date.', status: 'TO BE STARTED' },
  { date: '28–31 OCTOBER 2026', title: 'Residency', desc: '247 builders come together to build, ship, and launch projects in Goa.', status: 'TO BE STARTED' },
];

export const About: React.FC = () => {
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  return (
    <div className="about-page">
      {/* ── SECTION A: HERO INTRO ── */}
      <section className="about-hero container fade-in-up">
        <div className="about-hero-meta">
          <span className="mono-text">HACKER HOUSE</span>
          <span className="mono-text">GOA, INDIA · 28–31 OCT 2026</span>
          <span className="mono-text">2:47 PM STUDIO</span>
        </div>
        <h1 className="about-hero-title">Less noise.<br />More signal.</h1>
      </section>

      {/* ── SECTION B: EVENT PHILOSOPHY ── */}
      <section className="about-philosophy container fade-in-up">
        <div className="philosophy-content">
          <h2 className="philosophy-heading">Less Noise. More Signal</h2>
          <p className="philosophy-quote">"Most Hackathons Are Just Hype And No Substance. We're Changing That."</p>
          <div className="philosophy-text">
            <p>From October 28–31, the event takes over Goa for a major build-focused experience.</p>
            <p>It is aimed at developers/builders who live in their terminals and ship things that matter.</p>
            <ul className="philosophy-list">
              <li>No fluff. No useless networking.</li>
              <li>Pure build-focused environment.</li>
              <li>High-speed fiber connectivity.</li>
              <li>Ocean/beach environment.</li>
              <li>Building and shipping meaningful projects.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ── SECTION C: FAQ / ACCORDION ── */}
      <section className="about-faq container fade-in-up">
        <h2 className="section-title">How Are Teams Formed?</h2>
        
        <div className="accordion">
          <div className={`accordion-item ${faqOpen === 0 ? 'open' : ''}`}>
            <button className="accordion-header" onClick={() => toggleFaq(0)}>
              <span className="accordion-title">Can I Start Working On My Project Before The Event?</span>
              <span className="accordion-icon material-symbols-outlined">{faqOpen === 0 ? 'remove' : 'add'}</span>
            </button>
            <div className="accordion-body">
              <div className="accordion-content">
                You can brainstorm and plan, but all code must be written during the hackathon. Using existing libraries, APIs, and frameworks is encouraged — just don't bring pre-built solutions.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION D: ROADMAP / TIMELINE ── */}
      <section className="about-roadmap fade-in-up">
        <div className="container">
          <span className="mono-text section-kicker">THE ROADMAP</span>
          <h2 className="section-title">THE TIMELINE AT A GLANCE</h2>
        </div>
        
        <div className="timeline-container">
          <div className="timeline-track">
            {TIMELINE_DATA.map((item, idx) => (
              <div className={`timeline-card ${item.status === 'RUNNING' ? 'active' : ''}`} key={idx}>
                <div className="timeline-dot"></div>
                <div className="timeline-date">{item.date}</div>
                <h3 className="timeline-card-title">{item.title}</h3>
                <p className="timeline-card-desc">{item.desc}</p>
                <div className={`timeline-status ${item.status.replace(/ /g, '-').toLowerCase()}`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
