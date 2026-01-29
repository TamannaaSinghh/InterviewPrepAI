
import { Topic, Question } from './types';

export const COLORS = [
  'bg-emerald-50 text-emerald-700 border-emerald-100',
  'bg-amber-50 text-amber-700 border-amber-100',
  'bg-sky-50 text-sky-700 border-sky-100',
  'bg-rose-50 text-rose-700 border-rose-100',
  'bg-violet-50 text-violet-700 border-violet-100',
  'bg-indigo-50 text-indigo-700 border-indigo-100',
];

const createInitialQuestions = (role: string, qs: {q: string, a: string}[]): Question[] => {
  return qs.map((item, i) => ({
    id: `${role.toLowerCase().replace(/\s+/g, '-')}-${i}`,
    question: item.q,
    answer: item.a,
    isMastered: false
  }));
};

export const INITIAL_TOPICS: Topic[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    description: 'Master React, Modern CSS, and Web Performance for product-based company interviews.',
    skills: ['React.js', 'DOM manipulation', 'CSS Flexbox', 'TypeScript'],
    experience: '2 Years',
    qaCount: 10,
    lastUpdated: '30th Apr 2025',
    color: 'emerald',
    questions: createInitialQuestions('Frontend', [
      { q: "What is the Virtual DOM and how does React use it to optimize rendering?", a: "The Virtual DOM is a lightweight copy of the actual DOM. React uses it to perform 'diffing'—comparing the old state with the new state—and only updates the parts of the real DOM that actually changed, minimizing expensive browser reflows." },
      { q: "Explain the difference between useMemo and useCallback hooks.", a: "useMemo returns a memoized value of a function's result, while useCallback returns a memoized version of the function itself. Both are used to prevent unnecessary re-renders when passing props to optimized child components." },
      { q: "How does CSS Flexbox handle alignment along the main and cross axes?", a: "The main axis is defined by flex-direction (row/column). 'justify-content' aligns items along the main axis, while 'align-items' aligns them along the cross axis." },
      { q: "What are the advantages of using TypeScript over plain JavaScript?", a: "TypeScript provides static typing, which helps catch errors during development rather than at runtime. It improves IDE support, makes refactoring safer, and serves as living documentation for the codebase." },
      { q: "Explain the 'Closure' concept in JavaScript with a React example.", a: "A closure gives a function access to its outer scope even after the outer function has returned. In React, hooks like useEffect often rely on closures to access the current values of props and state within their callback functions." },
      { q: "What is Prop Drilling and how can you avoid it?", a: "Prop drilling is passing data through many layers of components that don't need it. It can be avoided using React Context API or state management libraries like Redux or Zustand." },
      { q: "What is the difference between SSR and CSR?", a: "CSR (Client-Side Rendering) renders the app in the browser using JS. SSR (Server-Side Rendering) generates the HTML on the server for each request, which is better for SEO and initial load speed." },
      { q: "How do you optimize a React application's performance?", a: "By using code-splitting (React.lazy), memoizing components (React.memo), optimizing images, avoiding anonymous functions in render, and using efficient state management." },
      { q: "Explain the 'Key' prop in React lists.", a: "Keys help React identify which items have changed, been added, or removed. They provide a stable identity to elements between re-renders for efficient DOM updates." },
      { q: "What are Higher-Order Components (HOC)?", a: "An HOC is a function that takes a component and returns a new component with enhanced functionality, allowing for logic reuse across different parts of an application." }
    ])
  },
  {
    id: '2',
    title: 'Backend Developer',
    description: 'Master backend system design, database optimization, and high-concurrency Node.js.',
    skills: ['Node.js', 'Express', 'REST APIs', 'MongoDB', 'Redis'],
    experience: '3 Years',
    qaCount: 10,
    lastUpdated: '1st May 2025',
    color: 'amber',
    questions: createInitialQuestions('Backend', [
      { q: "Explain the Node.js Event Loop.", a: "The Event Loop allows Node.js to perform non-blocking I/O operations despite being single-threaded. It offloads operations to the system kernel whenever possible and processes callbacks in different phases like timers, I/O, and closing events." },
      { q: "What is the difference between SQL and NoSQL databases?", a: "SQL databases are relational, structured, and use schemas (e.g., PostgreSQL). NoSQL databases are non-relational, document-based, and flexible (e.g., MongoDB), making them suitable for unstructured data and scaling horizontally." },
      { q: "How do you secure a REST API?", a: "Security measures include using HTTPS, implementing JWT for authentication, setting rate limits, validating input to prevent SQL/NoSQL injection, and using CORS to restrict unauthorized cross-origin requests." },
      { q: "What is Database Indexing and how does it improve performance?", a: "Indexing creates a data structure (like a B-tree) that allows the database to find records without scanning every row in a table. It significantly speeds up read queries but can slow down write operations." },
      { q: "Explain the concept of Microservices architecture.", a: "Microservices involve breaking a large monolithic application into smaller, independent services that communicate via APIs. This allows teams to scale, deploy, and update parts of the system independently." },
      { q: "What is Middleware in Express.js?", a: "Middleware functions have access to the request object (req), response object (res), and the next function. They can execute code, modify the request/response, or terminate the cycle before reaching the final route handler." },
      { q: "How does Redis improve application performance?", a: "Redis is an in-memory data structure store used as a database, cache, and message broker. By storing frequently accessed data in RAM, it reduces latency compared to fetching from a disk-based database." },
      { q: "What is horizontal vs vertical scaling?", a: "Vertical scaling (scaling up) means adding more power (CPU, RAM) to an existing server. Horizontal scaling (scaling out) means adding more servers to the resource pool and using a load balancer." },
      { q: "Explain ACID properties in databases.", a: "ACID stands for Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions), and Durability (permanent changes). These ensure database transactions are processed reliably." },
      { q: "What is a 'Race Condition' in backend development?", a: "A race condition occurs when multiple processes or threads access shared data and try to change it at the same time, leading to unpredictable results. It's often solved using locks or mutexes." }
    ])
  },
  {
    id: '3',
    title: 'DevOps Engineer',
    description: 'Scaling infrastructure with Kubernetes, Docker, and Automated CI/CD pipelines.',
    skills: ['CI/CD', 'Docker', 'Kubernetes', 'AWS', 'Terraform'],
    experience: '5 Years',
    qaCount: 10,
    lastUpdated: '30th Apr 2025',
    color: 'indigo',
    questions: createInitialQuestions('DevOps', [
      { q: "What is Infrastructure as Code (IaC) and why use it?", a: "IaC manages and provisions infrastructure through machine-readable definition files (e.g., Terraform, CloudFormation) rather than manual configuration. It ensures consistency, enables version control, and allows for automated deployments." },
      { q: "Explain the difference between a Container and a Virtual Machine.", a: "VMs virtualize hardware and include a full OS, making them heavy. Containers virtualize the OS kernel and share it with the host, making them lightweight, portable, and fast to start." },
      { q: "What is a Kubernetes Pod?", a: "A Pod is the smallest deployable unit in Kubernetes. It represents a single instance of a running process in a cluster and can contain one or more containers that share network and storage resources." },
      { q: "Describe a standard CI/CD pipeline.", a: "A pipeline typically includes stages for Code Commit, Automated Testing (Unit/Integration), Build (creating artifacts), Staging Deployment, and finally Production Deployment with monitoring." },
      { q: "What is Blue-Green Deployment?", a: "Blue-Green deployment is a strategy that uses two identical production environments. One (Blue) is live, while the other (Green) is where you deploy the new version. Once tested, traffic is routed to Green." },
      { q: "How do Docker layers work?", a: "Each command in a Dockerfile creates a new layer in the image. Layers are cached, so if you only change the last line of a Dockerfile, Docker only needs to rebuild that layer, speeding up the build process." },
      { q: "What is the purpose of Prometheus and Grafana?", a: "Prometheus is a monitoring system used for collecting metrics from targets at given intervals. Grafana is a visualization tool that connects to Prometheus to create dashboards for monitoring system health." },
      { q: "Explain 'Self-healing' in Kubernetes.", a: "Kubernetes monitors the state of your cluster. If a container or node fails, it automatically restarts, replaces, or reschedules containers to match the desired state defined in your configurations." },
      { q: "What is GitOps?", a: "GitOps is a practice where Git is the 'Single Source of Truth' for infrastructure and application configurations. Changes are applied via pull requests and automated sync tools like ArgoCD or Flux." },
      { q: "What is the 'Shift Left' security philosophy?", a: "Shift Left means integrating security testing and audits early in the development lifecycle (the 'left' side of the pipeline) rather than waiting until the deployment phase." }
    ])
  }
];
