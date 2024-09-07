"use client"; // Mark this file as a client component
import Link from "next/link";
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import { useEffect, useState } from "react"; // Import necessary hooks
import styles from "./Homepage.module.css";

const Home = () => {
  const [count, setCount] = useState(0);
  const router = useRouter();
  // Fetch the current count from the server
  useEffect(() => {
    const fetchCount = async () => {
      const response = await fetch("/api/waitlist/counter");
      const data = await response.json();
      setCount(data.count);
    };
    fetchCount();
  }, []);

  const handleJoinWaitlist = async (event) => {
    event.preventDefault(); // Prevent default form submission
    await fetch("/api/waitlist/join", {
      method: "POST",
    });
    router.push("/assistant"); // Redirect after joining the waitlist
  };

  const pushToSignUPage = () => {
    router.push("/sign-in");
  };

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <h1>Welcome to StockLink</h1>

        <h2>Join the Revolution in Stock Trading</h2>
        <p>Get real-time insights and advice directly from the stock chart.</p>
        <div className={styles.ctaButtons}>
          <button className={styles.joinNow} onClick={pushToSignUPage}>
            Try Now
          </button>
        </div>
        <p className={styles.counter}>Current waitlist count: {count}</p>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.featureBoxes}>
          <div className={styles.featureBox}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="features-icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>

            <h3>Real-Time Insights</h3>
            <p>
              Receive live updates and AI-driven insights on stock movements.
            </p>
          </div>
          <div className={styles.featureBox}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="features-icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
              />
            </svg>

            <h3>Expert Advice</h3>
            <p>Get professional advice tailored to your trading strategy.</p>
          </div>
          <div className={styles.featureBox}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="features-icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
              />
            </svg>

            <h3>User-Friendly Interface</h3>
            <p>Navigate with ease using our intuitive and modern design.</p>
          </div>
          <div className={styles.featureBox}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="features-icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V6.75a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 6.75v10.5a2.25 2.25 0 0 0 2.25 2.25Zm.75-12h9v9h-9v-9Z"
              />
            </svg>

            <h3>AI Analysis</h3>
            <p>
              Leverage advanced AI algorithms for in-depth market analysis and
              predictions.
            </p>
          </div>
          <div className={styles.featureBox}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="features-icon"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>

            <h3>Personalized Recommendations</h3>
            <p>
              Get tailored investment suggestions based on your risk tolerance
              and preferences.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={styles.pricingSection}>
        <h2>Choose Your Plan</h2>
        <div className={styles.pricingPlans}>
          <div className={styles.plan}>
            <h3>Free Plan</h3>
            <p>Access limited features with no cost.</p>
          </div>
          <div className={styles.plan}>
            <h3>$5/month</h3>
            <p>Get advanced features for personal use.</p>
          </div>
          <div className={styles.plan}>
            <h3>$20/month</h3>
            <p>Unlock all features with premium support.</p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={styles.benefitsSection}>
        <h2>Why Choose Us?</h2>
        <div className={styles.benefitCards}>
          <div className={styles.benefitCard}>
            <h3>Accuracy</h3>
            <p>Our AI delivers precise and reliable stock predictions.</p>
          </div>
          <div className={styles.benefitCard}>
            <h3>Trustworthy</h3>
            <p>Join thousands of users who trust our service.</p>
          </div>
          <div className={styles.benefitCard}>
            <h3>Support</h3>
            <p>24/7 customer support to assist with your needs.</p>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlistSection" className={styles.waitlistSection}>
        <h2>Dont Miss Out</h2>
        <p>
          Sign up now and be the first to experience the future of stock
          trading.
        </p>
        <form onSubmit={handleJoinWaitlist}>
          <input type="email" placeholder="Enter your email" required />
          <input type="submit" value="Sign In" />
        </form>
      </section>
    </div>
  );
};

export default Home;
