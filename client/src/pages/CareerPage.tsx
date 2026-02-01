import React, { useState, useEffect } from "react";

const jobPosts = [
  {
    title: "Admin",
    short: "Responsible for managing platform operations, user accounts, and ensuring smooth workflow.",
    full: `🌟 Join BloodSource as an Admin Executive\nHelp us build a better Bangladesh — one drop, one life at a time.\nWe’re seeking an energetic, detail-oriented individual to join our passionate team as an Admin Executive. Your organizational skills will help us make a real difference in people’s lives.\n\n🛠 What You’ll Do:\n- Manage day-to-day administrative tasks to keep our operations running smoothly.\n- Organize files, records, and documents.\n- Help schedule meetings and support internal communication.\n- Assist with basic HR tasks such as data entry and report preparation.\n- Maintain a tidy and efficient digital workspace.\n- Help plan internal activities and support team operations.\n- Be a reliable go-to person for all things organizational.\n\n🎯 What We’re Looking For:\n- Strong communication and organizational skills.\n- Willingness to learn, adapt, and take initiative.\n- A positive, problem-solving mindset.\n- Familiarity with office tools (Google Workspace, Excel, etc.) is a plus.\n- Team spirit and a passion for social impact.\n\n📚 Education:\nNo formal degree required — we value passion, reliability, and a commitment to our mission.\n\n💼 Experience:\nNo prior experience needed — dedication and a willingness to grow are most important.\n\n⏱ Job Type:\nVolunteer (Flexible hours — ideal for students or part-timers)\n\n🎁 What We Offer:\n- A supportive, inclusive community.\n- The opportunity to make a real impact.\n- Flexible, remote work environment.\n- Growth and learning opportunities as we expand.\n- Recognition and appreciation for your contributions.\n\n📍 Work Location:\nRemote (Work from anywhere in Bangladesh)\n\n📩 Apply Now:`
  },
  {
    title: "Moderator",
    short: "Monitor user activity, enforce community guidelines, and help maintain a safe environment.",
    full: `As a Moderator, you will monitor user activity, review reports, enforce community guidelines, and help maintain a positive and safe environment. You will work closely with the Admin team to resolve conflicts and support users.`
  }
];

// Placeholder team members
const teamMembers = [
  {
    name: "Ayesha Rahman",
    role: "Lead Developer",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote: "Building BloodSource has been a journey of passion and purpose."
  },
  {
    name: "Imran Hossain",
    role: "Community Manager",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    quote: "Our team is dedicated to saving lives, one connection at a time."
  },
  {
    name: "Sara Ahmed",
    role: "UI/UX Designer",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    quote: "Designing for impact means putting people first."
  }
];

const CareerPage: React.FC = () => {
  const [openJob, setOpenJob] = useState<null | number>(null);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [contactValue, setContactValue] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [currentMember, setCurrentMember] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);

  // Automatic sliding effect
  useEffect(() => {
    const interval = setInterval(() => {
      setSlideDirection('left');
      setCurrentMember((prev) => (prev + 1) % teamMembers.length);
    }, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, []);

  const nextMember = () => {
    setSlideDirection('left');
    setCurrentMember((prev) => (prev + 1) % teamMembers.length);
  };
  const prevMember = () => {
    setSlideDirection('right');
    setCurrentMember((prev) => (prev - 1 + teamMembers.length) % teamMembers.length);
  };

  // Animation state
  const [animating, setAnimating] = useState(false);
  useEffect(() => {
    if (slideDirection) {
      setAnimating(true);
      const timeout = setTimeout(() => {
        setAnimating(false);
        setSlideDirection(null);
      }, 400); // match animation duration
      return () => clearTimeout(timeout);
    }
  }, [currentMember]);

  const handleApplyClick = () => {
    setShowApplyForm(true);
    setSubmitted(false);
    setContactValue("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex-1 flex flex-col bg-facebook-gray min-h-screen">
      <main className="flex-1 flex items-center justify-center px-4 py-8 lg:py-0">
        <div className="w-full max-w-6xl mx-auto h-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center lg:divide-x lg:divide-facebook-border bg-white/80 rounded-xl shadow p-4 sm:p-8 h-full min-h-[520px]">
            {/* Brand & Job Posts Section */}
            <div className="text-left lg:pr-8 flex flex-col justify-center h-full lg:col-span-3 overflow-x-auto">
              <div className="mb-4">
                <h1 className="whitespace-nowrap text-4xl sm:text-6xl font-bold tracking-tight text-[#d91c1f] mb-2">Careers at BloodSource</h1>
                <p className="text-facebook-text text-lg sm:text-2xl font-normal leading-8 max-w-lg">
                  We are always looking for talented people to join our team. Check back soon for open positions!
                </p>
              </div>
              <div className="w-full max-w-xl">
                <div className="grid gap-4 sm:gap-6 grid-cols-1">
        {jobPosts.map((job, idx) => (
                    <div key={job.title} className="border border-facebook-border rounded-lg p-4 sm:p-6 bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer hover:bg-gray-50">
                      <h2 className="text-lg sm:text-xl font-semibold mb-2 text-facebook-text">{job.title}</h2>
                      <p className="mb-4 text-facebook-muted text-sm sm:text-base">{job.short}</p>
                      <div className="flex justify-end mt-4">
            <button
                          className="px-4 py-2 bg-[#d91c1f] hover:bg-red-700 text-white rounded w-auto font-semibold transition duration-200 ease-in-out"
              onClick={() => setOpenJob(idx)}
              aria-label={`View more details about ${job.title} position`}
            >
              View More
            </button>
                      </div>
          </div>
        ))}
      </div>
              </div>
              {/* Modal Popup (existing code) */}
      {openJob !== null && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50 px-2 animate-fade-in">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md sm:max-w-lg p-4 sm:p-6 relative mx-auto max-h-[90vh] overflow-y-auto mx-2">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
              onClick={() => setOpenJob(null)}
              aria-label="Close"
            >
              ×
            </button>
            <h2 className="text-xl sm:text-2xl font-extrabold text-red-700 mb-4 tracking-tight">{jobPosts[openJob].title}</h2>
            {jobPosts[openJob].title === "Admin" ? (
              <div className="space-y-4 text-gray-800 text-sm sm:text-base font-light mb-2">
                <div>
                  <span className="block text-lg sm:text-xl font-semibold text-red-700 mb-1">🌟 Join BloodSource as an Admin Executive</span>
                  <span>Help us build a better Bangladesh — one drop, one life at a time.</span>
                  <span className="block">We’re seeking an energetic, detail-oriented individual to join our passionate team as an Admin Executive. Your organizational skills will help us make a real difference in people’s lives.</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">🛠 What You’ll Do:</span>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>Manage day-to-day administrative tasks to keep our operations running smoothly.</li>
                    <li>Organize files, records, and documents.</li>
                    <li>Help schedule meetings and support internal communication.</li>
                    <li>Assist with basic HR tasks such as data entry and report preparation.</li>
                    <li>Maintain a tidy and efficient digital workspace.</li>
                    <li>Help plan internal activities and support team operations.</li>
                    <li>Be a reliable go-to person for all things organizational.</li>
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">🎯 What We’re Looking For:</span>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>Strong communication and organizational skills.</li>
                    <li>Willingness to learn, adapt, and take initiative.</li>
                    <li>A positive, problem-solving mindset.</li>
                    <li>Familiarity with office tools (Google Workspace, Excel, etc.) is a plus.</li>
                    <li>Team spirit and a passion for social impact.</li>
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">📚 Education:</span>
                  <div className="ml-4">No formal degree required — we value passion, reliability, and a commitment to our mission.</div>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">💼 Experience:</span>
                  <div className="ml-4">No prior experience needed — dedication and a willingness to grow are most important.</div>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">⏱ Job Type:</span>
                  <div className="ml-4">Volunteer (Flexible hours — ideal for students or part-timers)</div>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">🎁 What We Offer:</span>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>A supportive, inclusive community.</li>
                    <li>The opportunity to make a real impact.</li>
                    <li>Flexible, remote work environment.</li>
                    <li>Growth and learning opportunities as we expand.</li>
                    <li>Recognition and appreciation for your contributions.</li>
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">📍 Work Location:</span>
                  <div className="ml-4">Remote (Work from anywhere in Bangladesh)</div>
                </div>
              </div>
            ) : jobPosts[openJob].title === "Moderator" ? (
              <div className="space-y-4 text-gray-800 text-sm sm:text-base font-light mb-2">
                <div>
                  <span className="block text-lg sm:text-xl font-semibold text-red-700 mb-1">🛡️ Join BloodSource as a Moderator</span>
                  <span>Help us protect and nurture our growing community.</span>
                  <span className="block">At BloodSource, we believe every interaction matters. We're looking for a dedicated Moderator to help us keep our online spaces safe, respectful, and helpful — all while supporting our mission to save lives through blood donation.</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">🛠 What You’ll Do:</span>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>Monitor conversations across our platforms (social media, forums, or internal chats)</li>
                    <li>Enforce community rules and respond to inappropriate content</li>
                    <li>Support users by answering questions or directing them to the right info</li>
                    <li>Report and escalate any harmful or sensitive issues</li>
                    <li>Collaborate with the team to improve community experience</li>
                    <li>Help shape a kind, informative, and active community space</li>
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">🎯 What You’ll Need:</span>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>A calm and respectful communication style</li>
                    <li>Ability to stay cool under pressure or in conflict</li>
                    <li>Strong reading & writing skills (Bangla & English preferred)</li>
                    <li>Willingness to learn about our mission and values</li>
                    <li>Good judgment and basic tech know-how</li>
                    <li>Friendly, proactive attitude and emotional maturity</li>
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">📚 Education:</span>
                  <div className="ml-4">No degree required — empathy and presence matter most</div>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">💼 Experience:</span>
                  <div className="ml-4">No experience needed<br/>(If you've moderated a group or Discord server before, that’s a bonus!)</div>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">⏱ Job Type:</span>
                  <div className="ml-4">Volunteer / Part-Time / Free-Time Friendly<br/>(Work on your own schedule, but be active when needed)</div>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">🎁 What We Offer:</span>
                  <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                    <li>Purpose-driven work</li>
                    <li>A supportive, friendly team</li>
                    <li>Real impact in your community</li>
                    <li>Remote flexibility</li>
                    <li>And for now… our endless appreciation and love ❤️</li>
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-gray-900">📍 Work Location:</span>
                  <div className="ml-4">Remote (Anywhere in Bangladesh)</div>
                </div>
              </div>
            ) : (
              <p className="text-gray-800 whitespace-pre-line text-sm sm:text-base font-light mb-2">{jobPosts[openJob].full.replace(/📩 Apply Now:?$/m, "")}</p>
            )}
            {/* Apply Now Button or Form */}
            {((jobPosts[openJob].title === "Admin") || (jobPosts[openJob].title === "Moderator")) && (
              <div className="flex flex-col items-center mt-6">
                {!showApplyForm && !submitted && (
                  <button
                    className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-base font-semibold flex items-center gap-2"
                    onClick={handleApplyClick}
                  >
                    <span role="img" aria-label="Apply Now">📩</span> Apply Now
                  </button>
                )}
                {showApplyForm && !submitted && (
                  <form onSubmit={handleFormSubmit} className="w-full max-w-xs mt-4 flex flex-col gap-3">
                    <div className="text-xs text-gray-500 text-center mb-1">we'll connect to you</div>
                    <label className="text-sm font-medium text-gray-700">Phone / Email</label>
                    <input
                      type="text"
                      required
                      value={contactValue}
                      onChange={e => setContactValue(e.target.value)}
                      className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="Enter your phone or email"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold"
                    >
                      Submit
                    </button>
                  </form>
                )}
                {submitted && (
                  <div className="mt-4 text-green-700 font-semibold text-center">Thank you! We'll connect to you soon.</div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
            </div>
            {/* Team Member Slider Section */}
            <div className="flex flex-col items-center justify-center h-full w-full lg:pl-8 lg:col-span-2">
              <div className="w-full max-w-sm bg-white rounded-lg shadow-lg p-0 flex flex-col items-center border border-facebook-border overflow-hidden h-[420px] self-center justify-center">
                <img
                  src={teamMembers[currentMember].image}
                  alt={teamMembers[currentMember].name}
                  className="w-full h-72 object-cover object-top mb-0 rounded-none shadow-md border border-facebook-border transition duration-300"
                  style={{ aspectRatio: '3/4' }}
                />
                <div className="p-6 w-full flex flex-col items-center text-center">
                  <h3 className="text-xl font-bold text-facebook-text mb-2">{teamMembers[currentMember].name}</h3>
                  <p className="text-red-600 font-semibold mb-4">{teamMembers[currentMember].role}</p>
                  <blockquote className="italic text-facebook-muted mb-0">“{teamMembers[currentMember].quote}”</blockquote>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CareerPage; 