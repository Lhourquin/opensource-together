# 🗃️ Modèle Logique de Données (MLD) — Open Source Together

## 📋 Vue d'ensemble

Ce document présente le **Modèle Logique de Données** d'OST, transformant le MCD en structure de tables relationnelles prêtes pour l'implémentation.

---

## 🏗️ Structure des Tables

### **📊 Tables Principales**

#### **users**
```sql
CREATE TABLE users (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username           VARCHAR(30) NOT NULL UNIQUE,
    email              VARCHAR(255) NOT NULL UNIQUE,
    bio                TEXT,
    github_username    VARCHAR(39) UNIQUE,
    linkedin_url       VARCHAR(500),
    github_url         VARCHAR(500),
    portfolio_url      VARCHAR(500),
    contribution_score INTEGER DEFAULT 0 CHECK (contribution_score >= 0),
    level              VARCHAR(20) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    is_open_to_hire    BOOLEAN DEFAULT false,
    location           VARCHAR(100),
    timezone           VARCHAR(50),
    created_at         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### **skill_categories**
```sql
CREATE TABLE skill_categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon_url    VARCHAR(500),
    color       CHAR(7), -- Format #RRGGBB
    sort_order  INTEGER DEFAULT 0,
    is_active   BOOLEAN DEFAULT true,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### **skills**
```sql
CREATE TABLE skills (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_category_id UUID NOT NULL REFERENCES skill_categories(id) ON DELETE RESTRICT,
    name              VARCHAR(100) NOT NULL UNIQUE,
    description       TEXT,
    icon_url          VARCHAR(500),
    color             CHAR(7), -- Format #RRGGBB
    is_technical      BOOLEAN DEFAULT true,
    popularity_score  INTEGER DEFAULT 0 CHECK (popularity_score >= 0),
    is_active         BOOLEAN DEFAULT true,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### **projects**
```sql
CREATE TABLE projects (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id                UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title                   VARCHAR(100) NOT NULL,
    description             TEXT NOT NULL,
    vision                  TEXT NOT NULL,
    github_main_repo        VARCHAR(500) NOT NULL,
    website_url             VARCHAR(500),
    documentation_url       VARCHAR(500),
    difficulty              VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
    status                  VARCHAR(15) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')),
    is_seeking_contributors BOOLEAN DEFAULT true,
    project_type            VARCHAR(15) CHECK (project_type IN ('library', 'application', 'tool', 'framework', 'other')),
    license                 VARCHAR(20) CHECK (license IN ('MIT', 'Apache-2.0', 'GPL-3.0', 'custom', 'other')),
    stars_count             INTEGER DEFAULT 0 CHECK (stars_count >= 0),
    contributors_count      INTEGER DEFAULT 0 CHECK (contributors_count >= 0),
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### **project_roles**
```sql
CREATE TABLE project_roles (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id           UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title                VARCHAR(100) NOT NULL,
    description          TEXT NOT NULL,
    responsibility_level VARCHAR(15) NOT NULL CHECK (responsibility_level IN ('contributor', 'maintainer', 'lead')),
    time_commitment      VARCHAR(15) NOT NULL CHECK (time_commitment IN ('few_hours', 'part_time', 'full_time')),
    slots_available      INTEGER NOT NULL CHECK (slots_available >= 0),
    slots_filled         INTEGER DEFAULT 0 CHECK (slots_filled >= 0),
    is_remote_friendly   BOOLEAN DEFAULT true,
    experience_required  VARCHAR(15) NOT NULL CHECK (experience_required IN ('none', 'some', 'experienced')),
    created_at           TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_slots_consistency CHECK (slots_filled <= slots_available)
);
```

---

### **🔗 Tables de Liaison**

#### **user_skills**
```sql
CREATE TABLE user_skills (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id          UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(15) NOT NULL CHECK (proficiency_level IN ('learning', 'basic', 'intermediate', 'advanced', 'expert')),
    years_experience  INTEGER CHECK (years_experience >= 0),
    is_primary        BOOLEAN DEFAULT false,
    endorsed_count    INTEGER DEFAULT 0 CHECK (endorsed_count >= 0),
    last_used         DATE,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(user_id, skill_id)
);
```

#### **project_role_skills**
```sql
CREATE TABLE project_role_skills (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_role_id   UUID NOT NULL REFERENCES project_roles(id) ON DELETE CASCADE,
    skill_id          UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level VARCHAR(15) NOT NULL CHECK (proficiency_level IN ('basic', 'intermediate', 'advanced')),
    is_required       BOOLEAN DEFAULT true,
    
    UNIQUE(project_role_id, skill_id)
);
```

#### **applications**
```sql
CREATE TABLE applications (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_role_id     UUID NOT NULL REFERENCES project_roles(id) ON DELETE CASCADE,
    motivation_message  TEXT NOT NULL,
    portfolio_links     JSONB, -- Array d'URLs
    availability        VARCHAR(15) NOT NULL CHECK (availability IN ('immediate', 'within_week', 'within_month')),
    status              VARCHAR(15) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
    reviewed_by         UUID REFERENCES users(id) ON DELETE SET NULL,
    review_message      VARCHAR(500),
    applied_at          TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    reviewed_at         TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(user_id, project_role_id),
    CONSTRAINT chk_review_timing CHECK (reviewed_at >= applied_at OR reviewed_at IS NULL)
);
```

#### **team_members**
```sql
CREATE TABLE team_members (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    project_role_id     UUID NOT NULL REFERENCES project_roles(id) ON DELETE CASCADE,
    status              VARCHAR(15) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'left')),
    contributions_count INTEGER DEFAULT 0 CHECK (contributions_count >= 0),
    joined_at           TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    left_at             TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(user_id, project_id),
    CONSTRAINT chk_leave_timing CHECK (left_at >= joined_at OR left_at IS NULL)
);
```

---

### **🎯 Tables de Contribution**

#### **good_first_issues**
```sql
CREATE TABLE good_first_issues (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id       UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    created_by       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title            VARCHAR(200) NOT NULL,
    description      TEXT NOT NULL,
    github_issue_url VARCHAR(500),
    estimated_time   VARCHAR(10) CHECK (estimated_time IN ('30min', '1h', '2h', '4h', '1day')),
    difficulty       VARCHAR(15) NOT NULL CHECK (difficulty IN ('very_easy', 'easy', 'medium')),
    status           VARCHAR(15) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'completed', 'closed')),
    assigned_to      UUID REFERENCES users(id) ON DELETE SET NULL,
    is_ai_generated  BOOLEAN DEFAULT false,
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at     TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT chk_completion_timing CHECK (completed_at >= created_at OR completed_at IS NULL)
);
```

#### **issue_skills**
```sql
CREATE TABLE issue_skills (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    issue_id   UUID NOT NULL REFERENCES good_first_issues(id) ON DELETE CASCADE,
    skill_id   UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    
    UNIQUE(issue_id, skill_id)
);
```

#### **contributions**
```sql
CREATE TABLE contributions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    issue_id      UUID REFERENCES good_first_issues(id) ON DELETE SET NULL,
    type          VARCHAR(20) NOT NULL CHECK (type IN ('code', 'design', 'documentation', 'bug_fix', 'feature', 'other')),
    title         VARCHAR(200) NOT NULL,
    description   TEXT,
    github_pr_url VARCHAR(500),
    status        VARCHAR(15) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'merged', 'rejected')),
    reviewed_by   UUID REFERENCES users(id) ON DELETE SET NULL,
    submitted_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    merged_at     TIMESTAMP WITH TIME ZONE,
    
    CONSTRAINT chk_merge_timing CHECK (merged_at >= submitted_at OR merged_at IS NULL)
);
```

---

### **🔧 Tables de Support**

#### **linked_repositories**
```sql
CREATE TABLE linked_repositories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    github_url  VARCHAR(500) NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description VARCHAR(500),
    is_main     BOOLEAN DEFAULT false,
    language    VARCHAR(50),
    stars_count INTEGER DEFAULT 0 CHECK (stars_count >= 0),
    last_sync   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(project_id, github_url)
);
```

---

## 🚀 Index et Optimisations

### **Index Principaux**
```sql
-- Index pour les recherches fréquentes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_github_username ON users(github_username) WHERE github_username IS NOT NULL;
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_contribution_score ON users(contribution_score DESC);

-- Index pour les projets
CREATE INDEX idx_projects_owner_id ON projects(owner_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_difficulty ON projects(difficulty);
CREATE INDEX idx_projects_seeking ON projects(is_seeking_contributors) WHERE is_seeking_contributors = true;

-- Index pour les compétences
CREATE INDEX idx_skills_category_id ON skills(skill_category_id);
CREATE INDEX idx_skills_is_active ON skills(is_active) WHERE is_active = true;
CREATE INDEX idx_skill_categories_sort_order ON skill_categories(sort_order);

-- Index composés pour les relations
CREATE INDEX idx_user_skills_user_skill ON user_skills(user_id, skill_id);
CREATE INDEX idx_project_role_skills_role_skill ON project_role_skills(project_role_id, skill_id);
CREATE INDEX idx_applications_status_date ON applications(status, applied_at);
CREATE INDEX idx_team_members_project_status ON team_members(project_id, status);

-- Index pour les contributions
CREATE INDEX idx_contributions_user_project ON contributions(user_id, project_id);
CREATE INDEX idx_contributions_project_status ON contributions(project_id, status);
CREATE INDEX idx_good_first_issues_project_status ON good_first_issues(project_id, status);
```

### **Index de Performance**
```sql
-- Index pour l'algorithme de matching
CREATE INDEX idx_matching_user_skills ON user_skills(skill_id, proficiency_level) WHERE proficiency_level IN ('intermediate', 'advanced', 'expert');
CREATE INDEX idx_matching_project_skills ON project_role_skills(skill_id, proficiency_level, is_required);

-- Index pour les tableaux de bord
CREATE INDEX idx_dashboard_user_applications ON applications(user_id, status, applied_at DESC);
CREATE INDEX idx_dashboard_user_contributions ON contributions(user_id, submitted_at DESC);
CREATE INDEX idx_dashboard_project_members ON team_members(project_id, status, joined_at DESC);
```

---

## 🔒 Contraintes et Triggers

### **Triggers de Mise à Jour**
```sql
-- Trigger pour updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Application du trigger sur toutes les tables principales
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ... (autres tables)
```

### **Contraintes Métier**
```sql
-- Empêcher les candidatures sur ses propres projets
ALTER TABLE applications ADD CONSTRAINT chk_no_self_application 
CHECK (user_id != (SELECT owner_id FROM projects p JOIN project_roles pr ON p.id = pr.project_id WHERE pr.id = project_role_id));

-- Vérifier que les issues assignées le sont à des membres du projet
ALTER TABLE good_first_issues ADD CONSTRAINT chk_assigned_to_member
CHECK (assigned_to IS NULL OR EXISTS (
    SELECT 1 FROM team_members tm 
    WHERE tm.user_id = assigned_to 
    AND tm.project_id = good_first_issues.project_id 
    AND tm.status = 'active'
));
```

---

## 📊 Vues Utiles

### **Vue des Projets Enrichis**
```sql
CREATE VIEW v_projects_enriched AS
SELECT 
    p.*,
    u.username as owner_username,
    COUNT(DISTINCT tm.user_id) as active_members_count,
    COUNT(DISTINCT pr.id) as roles_count,
    COUNT(DISTINCT gfi.id) as open_issues_count
FROM projects p
JOIN users u ON p.owner_id = u.id
LEFT JOIN team_members tm ON p.id = tm.project_id AND tm.status = 'active'
LEFT JOIN project_roles pr ON p.id = pr.project_id
LEFT JOIN good_first_issues gfi ON p.id = gfi.project_id AND gfi.status IN ('open', 'assigned')
GROUP BY p.id, u.username;
```

### **Vue des Statistiques Utilisateur**
```sql
CREATE VIEW v_user_stats AS
SELECT 
    u.id,
    u.username,
    u.contribution_score,
    COUNT(DISTINCT us.skill_id) as skills_count,
    COUNT(DISTINCT tm.project_id) as active_projects_count,
    COUNT(DISTINCT c.id) as contributions_count,
    COUNT(DISTINCT a.id) FILTER (WHERE a.status = 'accepted') as accepted_applications_count
FROM users u
LEFT JOIN user_skills us ON u.id = us.user_id
LEFT JOIN team_members tm ON u.id = tm.user_id AND tm.status = 'active'
LEFT JOIN contributions c ON u.id = c.user_id AND c.status = 'merged'
LEFT JOIN applications a ON u.id = a.user_id
GROUP BY u.id, u.username, u.contribution_score;
```

---

## 🎯 Migration et Évolution

### **Stratégie de Migration depuis l'Existant**
1. **Mapping des entités existantes** vers le nouveau schéma
2. **Migration des données User** → conservation des données actuelles + nouveaux champs NULL
3. **Création SkillCategory** → insertion des catégories de base
4. **Migration TechStack** → transformation en Skills avec category_id
5. **Ajustement des relations** → mise à jour des foreign keys

### **Données de Base à Insérer**
```sql
-- Catégories de compétences de base
INSERT INTO skill_categories (name, description, sort_order) VALUES
('Frontend', 'Technologies de développement front-end', 1),
('Backend', 'Technologies de développement back-end', 2),
('Design', 'Compétences en design et UX/UI', 3),
('DevOps', 'Outils et pratiques DevOps', 4),
('Mobile', 'Développement d\'applications mobiles', 5),
('Marketing', 'Marketing digital et growth', 6),
('Data', 'Data Science et Analytics', 7),
('Other', 'Autres compétences', 99);
```

---

*Ce MLD constitue la base technique pour l'implémentation du nouveau schéma Prisma et la migration de la base de données existante.* 