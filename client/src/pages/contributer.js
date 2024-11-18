import React from 'react';
import { Github, Linkedin, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import './ContributorsPage.css';

const Avatar = ({ src, alt, fallback }) => (
  <div className="avatar">
    {src ? (
      <img src={src} alt={alt} className="avatar-image" />
    ) : (
      <span className="avatar-fallback">{fallback}</span>
    )}
  </div>
);


const Card = ({ children }) => (
  <div className="card">{children}</div>
);

const CardContent = ({ children }) => (
  <div className="card-content">{children}</div>
);

const contributors = [
  {
    name: 'Sumit Sagar',
    role: 'Lead Developer',
    avatar: '/SUMIT_SAGAR.jpg',
    github: 'https://github.com/Sumit45Sagar',
    linkedin: 'https://www.linkedin.com/in/sumit-sagar-3813b5216/',
    website: 'https://sumitsagarportfolio.netlify.app/',
    expertise: ['React', 'Node.js', 'API', ' Web Socket'],
  },
  {
    name: 'Vivek Nehra',
    role: 'Frontend Specialist',
    avatar: '/vivek.jpg',
    github: 'https://github.com/Vivek7411',
    linkedin: 'https://linkedin.com/in/viveknehra',
    website: 'https://viveknehra.com',
    expertise: ['AWS', 'React', 'CSS', 'UI/UX Design'],
  },
  {
    name: 'Vikhyat Garg',
    role: 'Backend Engineer',
    avatar: '/vikhyat.jpg',
    github: 'https://github.com/vikhyat9690',
    linkedin: 'https://linkedin.com/in/vikhyat-garg',
    website: 'https://vikhyatgarg.io',
    expertise: ['MongoDB', 'Node.js', 'Express', 'Authentication'],
  },
];

const ContributorCard = ({ name, role, avatar, github, linkedin, website, expertise }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    transition={{ type: 'spring', stiffness: 300 }}
  >
    <Card>
      <div className="card-header"></div>
      <CardContent>
        <div className="avatar-wrapper">
          <Avatar
            src={avatar}
            alt={name}
            fallback={name.split(' ').map((n) => n[0]).join('')}
          />
        </div>
        <h3 className="contributor-name">{name}</h3>
        <p className="contributor-role">{role}</p>
        <div className="expertise-tags">
          {expertise.map((tag, index) => (
            <span className="expertise-tag" key={index}>{tag}</span>
          ))}
        </div>
        <div className="social-icons">
          <a href={github} target="_blank" rel="noopener noreferrer">
            <Github />
          </a>
          <a href={linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin />
          </a>
          <a href={website} target="_blank" rel="noopener noreferrer">
            <Globe />
          </a>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

export default function ContributorsPage() {
  return (
    <div className="contributors-page">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="header"
        >
          <h1>Our Amazing Contributors</h1>
          <p>The talented individuals behind Codex</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="contributors-grid"
        >
          {contributors.map((contributor, index) => (
            <ContributorCard {...contributor} key={index} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}