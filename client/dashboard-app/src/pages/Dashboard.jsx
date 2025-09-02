import SplitText from "../components/SplitText";
import AnimatedContent from "../components/AnimatedContent";
import "../styles/Dashboard.css";

export default function Dashboard() {
  // frontend

  return (
    <div>
      <div class="dashboard-container">
        <div class="welcome-card">
          <h1 class="welcome-title">Welcome to Your Dashboard!</h1>
          <p class="welcome-subtitle">
            Track your learning progress and access your courses
          </p>
        </div>

        <div class="dashboard-grid" data-role="Admin">
          <div class="dashboard-card">
            <div class="card-icon">📚</div>
            <h2 class="card-title">My Courses</h2>
            <p class="card-description">
              Access your enrolled courses and continue learning
            </p>
            <span class="coming-soon">Coming Soon</span>
          </div>

          <div class="dashboard-card">
            <div class="card-icon">📊</div>
            <h2 class="card-title">Progress Tracking</h2>
            <p class="card-description">
              Monitor your learning progress and achievements
            </p>
            <span class="coming-soon">Coming Soon</span>
          </div>

          <div class="dashboard-card">
            <div class="card-icon">✍️</div>
            <h2 class="card-title">Practice Tests</h2>
            <p class="card-description">
              Take IELTS mock tests and practice exercises
            </p>
            <span class="coming-soon">Coming Soon</span>
          </div>

          <div class="dashboard-card">
            <div class="card-icon">💬</div>
            <h2 class="card-title">Speaking Practice</h2>
            <p class="card-description">
              Improve your speaking skills with AI-powered practice
            </p>
            <span class="coming-soon">Coming Soon</span>
          </div>

          <div class="dashboard-card">
            <div class="card-icon">📝</div>
            <h2 class="card-title">Writing Lab</h2>
            <p class="card-description">
              Practice writing with instant feedback and corrections
            </p>
            <span class="coming-soon">Coming Soon</span>
          </div>

          <div class="dashboard-card">
            <div class="card-icon">🎯</div>
            <h2 class="card-title">Goals & Achievements</h2>
            <p class="card-description">
              Set learning goals and track your achievements
            </p>
            <span class="coming-soon">Coming Soon</span>
          </div>
        </div>
      </div>
    </div>
    // <h1>Dashboard Page</h1>
    // <AnimatedContent
    //   className="main"
    //   distance={160}
    //   direction="vertical"
    //   reverse={false}
    //   duration={0.7}
    //   ease="power3.out"
    //   initialOpacity={0}
    //   animateOpacity
    //   initialScale={0.1}
    //   scale={0.1}
    //   threshold={0.2}
    //   delay={0}
    // >

    // </AnimatedContent>
  );
}
// eslint-disable-next-line no-unused-vars
async function handleLogout() {
  try {
    const resp = await fetch("/api/logout", {
      method: "POST",
      credentials: "include", // bắt buộc để gửi cookie
      headers: { "Content-Type": "application/json" },
    });

    if (resp.ok) {
      // clear client-side auth state (redux, context, localStorage...)
      localStorage.removeItem("authToken");
      // redirect, dùng replace để không còn trang logout trong history
      window.location.replace("/");
    } else {
      console.error("Logout failed", await resp.text());
      // show error nếu muốn
    }
  } catch (err) {
    console.error("Network/logout error", err);
  }
}
