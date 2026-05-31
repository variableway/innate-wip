# Source: https://betterstack.com/community/guides/scaling-nodejs/nextjs-vs-remix-vs-nuxt-3/
# Original language: jsx
# Normalized: js
# Block index: 10

// CSS Modules - styles/User.module.css
.card {
  border: 1px solid #eaeaea;
  border-radius: 10px;
  padding: 20px;
  margin: 10px 0;
}

// Using CSS Modules - components/UserCard.js
import styles from '../styles/User.module.css';

export default function UserCard({ user }) {
  return (
    <div className={styles.card}>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
}

// Using styled-jsx (built-in)
export default function AnotherComponent() {
  return (
    <div className="container">
      <p>Styled with styled-jsx</p>
      
      <style jsx>{`
        .container {
          background: #f0f0f0;
          padding: 20px;
        }
        p {
          color: blue;
        }
      `}</style>
    </div>
  );
}