# Experience Demonstration Strategy

## Overview

This project includes 3 versions of Express + MongoDB to demonstrate experience across different technology eras and coding patterns.

## Projects

### 1. Express + MongoDB (2024) - Modern
**Location:** `servers/express/express-mongodb/`  
**Port:** 5000  
**Technology Stack:**
- Node.js: v18+
- Express: v4.18+
- MongoDB: v7+ (Mongoose v7+)
- React: v18+

**Coding Patterns:**
- Modern async/await throughout
- ES6+ features
- Modern error handling
- Clean architecture with `src/` folder
- Latest best practices

**Demonstrates:**
- Current industry standards
- Modern JavaScript patterns
- Latest framework features
- Best practices (2024)

---

### 2. Express + MongoDB (2021) - 3 Years Old
**Location:** `servers/express/express-mongodb-3yr/`  
**Port:** 5006  
**Technology Stack:**
- Node.js: v14+
- Express: v4.17.1
- MongoDB: v4+ (Mongoose v6.0.13)
- React: v17

**Coding Patterns:**
- Mix of async/await and promises
- Transitional patterns
- Traditional folder structure (root level)
- Mongoose 6 connection options

**Demonstrates:**
- Understanding of transitional patterns
- Experience with mid-level codebases
- Ability to work with mixed async patterns
- Knowledge of framework evolution

---

### 3. Express + MongoDB (2018) - 6 Years Old / Legacy
**Location:** `servers/express/express-mongodb-6yr/`  
**Port:** 5007  
**Technology Stack:**
- Node.js: v10+
- Express: v4.16.4
- MongoDB: v3+ (Mongoose v5.7.0)
- React: v16

**Coding Patterns:**
- Callback-based code
- Traditional function declarations
- Legacy MVC structure
- Mongoose 5 connection options
- File named `app.js` (older convention)

**Demonstrates:**
- Deep understanding of legacy patterns
- Experience maintaining older codebases
- Ability to work with callback-based code
- Senior-level experience with ecosystem evolution
- Knowledge of migration strategies

---

## Key Differences

| Feature | Modern (2024) | 3yr (2021) | 6yr (2018) |
|---------|---------------|------------|-------------|
| **Structure** | `src/` folder | Root level | Root level |
| **Main File** | `src/server.js` | `server.js` | `app.js` |
| **Code Style** | Async/await | Mix | Callbacks |
| **Mongoose** | v7+ | v6 | v5 |
| **Express** | v4.18+ | v4.17 | v4.16 |
| **Error Handling** | Modern middleware | Basic | Traditional |
| **Validation** | express-validator v7 | v6 | v5 |
| **Node Version** | v18+ | v14+ | v10+ |

---

## Portfolio Benefits

### 1. Experience Range
Shows ability to work with:
- Modern codebases
- Mid-level codebases
- Legacy systems

### 2. Technology Evolution
Demonstrates understanding of:
- Framework version differences
- Pattern evolution (callbacks → promises → async/await)
- Best practices across eras

### 3. Migration Experience
Shows capability to:
- Maintain legacy code
- Upgrade systems
- Understand migration paths

### 4. Versatility
Proves ability to:
- Work in different environments
- Adapt to different coding styles
- Understand historical context

---

## Usage

### Run Modern Version
```bash
npm run dev:express-mongodb
```

### Run 3 Year Old Version
```bash
npm run dev:express-mongodb-3yr
```

### Run 6 Year Old / Legacy Version
```bash
npm run dev:express-mongodb-6yr
```

### Switch Frontend
```bash
npm run switch:express-mongodb-3yr
npm run switch:express-mongodb-6yr
```

---

## Interview Talking Points

1. **"I have experience with modern and legacy codebases"**
   - Show modern project for current skills
   - Show legacy project for maintenance experience

2. **"I understand technology evolution"**
   - Explain differences between versions
   - Discuss migration strategies

3. **"I can work with different coding patterns"**
   - Demonstrate flexibility
   - Show adaptation skills

4. **"I have 6 years of experience"**
   - Show progression from 2018 to 2024
   - Demonstrate continuous learning

---

## Notes

- All projects use the same API contracts
- Frontend works with all three backends
- Same features, different implementations
- Demonstrates real-world experience progression

