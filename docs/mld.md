<!--
# 🗃️ Modèle Logique de Données (MLD) — Open Source Together

## 📋 Vue d'ensemble

Ce document présente le **Modèle Logique de Données** d'OST, transformant le MCD en structure de tables relationnelles prêtes pour l'implémentation.

---

## 🏗️ Structure des Tables

### **📊 Tables Principales**

#### **users**

```sql
CREATE TABLE users (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Identifiant unique de l'utilisateur
    username           VARCHAR(30) NOT NULL UNIQUE, -- Nom d'utilisateur unique
    email              VARCHAR(255) NOT NULL UNIQUE, -- Email unique
    bio                TEXT, -- Biographie de l'utilisateur
    github_username    VARCHAR(39) UNIQUE, -- Nom d'utilisateur GitHub
    linkedin_url       VARCHAR(500), -- URL LinkedIn
    github_url         VARCHAR(500), -- URL GitHub
    portfolio_url      VARCHAR(500), -- URL du portfolio
    contribution_score INTEGER DEFAULT 0 CHECK (contribution_score >= 0), -- Score de contribution
    level              VARCHAR(20) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')), -- Niveau de l'utilisateur
    is_open_to_hire    BOOLEAN DEFAULT false, -- Indique si l'utilisateur est ouvert aux offres d'emploi
    location           VARCHAR(100), -- Localisation de l'utilisateur
    timezone           VARCHAR(50), -- Fuseau horaire de l'utilisateur
    created_at         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Date de création
    updated_at         TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Date de mise à jour
);
```

#### **skill_categories**

```sql
CREATE TABLE skill_categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Identifiant unique de la catégorie
    name        VARCHAR(50) NOT NULL UNIQUE, -- Nom de la catégorie
    description TEXT, -- Description de la catégorie
    icon_url    VARCHAR(500), -- URL de l'icône
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Date de création
    updated_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Date de mise à jour
);
```

#### **skills**

```sql
CREATE TABLE skills (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Identifiant unique de la compétence
    skill_category_id UUID NOT NULL REFERENCES skill_categories(id) ON DELETE RESTRICT, -- Référence à la catégorie
    name              VARCHAR(100) NOT NULL UNIQUE, -- Nom de la compétence
    description       TEXT, -- Description de la compétence
    icon_url          VARCHAR(500), -- URL de l'icône
    is_technical      BOOLEAN DEFAULT true, -- Indique si la compétence est technique
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Date de création
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Date de mise à jour
);
```

#### **projects**

```sql
CREATE TABLE projects (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Identifiant unique du projet
    owner_id                UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Référence à l'utilisateur propriétaire
    title                   VARCHAR(100) NOT NULL, -- Titre du projet
    description             TEXT NOT NULL, -- Description du projet
    vision                  TEXT NOT NULL, -- Vision du projet
    github_main_repo        VARCHAR(500) NOT NULL, -- URL du dépôt GitHub principal
    website_url             VARCHAR(500), -- URL du site web
    documentation_url       VARCHAR(500), -- URL de la documentation
    difficulty              VARCHAR(10) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')), -- Difficulté du projet
    status                  VARCHAR(15) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'archived')), -- Statut du projet
    is_seeking_contributors BOOLEAN DEFAULT true, -- Indique si le projet recherche des contributeurs
    project_type            VARCHAR(15) CHECK (project_type IN ('library', 'application', 'tool', 'framework', 'other')), -- Type de projet
    license                 VARCHAR(20) CHECK (license IN ('MIT', 'Apache-2.0', 'GPL-3.0', 'custom', 'other')), -- Licence du projet
    stars_count             INTEGER DEFAULT 0 CHECK (stars_count >= 0), -- Nombre d'étoiles
    contributors_count      INTEGER DEFAULT 0 CHECK (contributors_count >= 0), -- Nombre de contributeurs
    created_at              TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Date de création
    updated_at              TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Date de mise à jour
);
```

#### **project_roles**

```sql
CREATE TABLE project_roles (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Identifiant unique du rôle
    project_id           UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, -- Référence au projet
    title                VARCHAR(100) NOT NULL, -- Titre du rôle
    description          TEXT NOT NULL, -- Description du rôle
    responsibility_level VARCHAR(15) NOT NULL CHECK (responsibility_level IN ('contributor', 'maintainer', 'lead')), -- Niveau de responsabilité
    time_commitment      VARCHAR(15) NOT NULL CHECK (time_commitment IN ('few_hours', 'part_time', 'full_time')), -- Engagement temporel
    slots_available      INTEGER NOT NULL CHECK (slots_available >= 0), -- Nombre de places disponibles
    slots_filled         INTEGER DEFAULT 0 CHECK (slots_filled >= 0), -- Nombre de places remplies
    experience_required  VARCHAR(15) NOT NULL CHECK (experience_required IN ('none', 'some', 'experienced')), -- Expérience requise
    created_at           TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Date de création

    CONSTRAINT chk_slots_consistency CHECK (slots_filled <= slots_available) -- Vérifie que le nombre de places remplies ne dépasse pas le nombre de places disponibles
);
```

---

### **🔗 Tables de Liaison**

#### **user_skills**

```sql
CREATE TABLE user_skills (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Identifiant unique de la compétence utilisateur
    user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Référence à l'utilisateur
    skill_id          UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE, -- Référence à la compétence
    proficiency_level VARCHAR(15) NOT NULL CHECK (proficiency_level IN ('learning', 'basic', 'intermediate', 'advanced', 'expert')), -- Niveau de compétence
    is_primary        BOOLEAN DEFAULT false, -- Indique si c'est une compétence principale
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Date de création

    UNIQUE(user_id, skill_id) -- Assure qu'un utilisateur ne peut pas avoir la même compétence en double
);
```

#### **project_role_skills**

```sql
CREATE TABLE project_role_skills (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Identifiant unique de la compétence de rôle
    project_role_id   UUID NOT NULL REFERENCES project_roles(id) ON DELETE CASCADE, -- Référence au rôle
    skill_id          UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE, -- Référence à la compétence
    proficiency_level VARCHAR(15) NOT NULL CHECK (proficiency_level IN ('basic', 'intermediate', 'advanced')), -- Niveau de compétence requis
    is_required       BOOLEAN DEFAULT true, -- Indique si la compétence est requise

    UNIQUE(project_role_id, skill_id) -- Assure qu'un rôle ne peut pas avoir la même compétence en double
);
```

#### **applications**

```sql
CREATE TABLE applications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Identifiant unique de la candidature
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Référence à l'utilisateur
    project_role_id UUID NOT NULL REFERENCES project_roles(id) ON DELETE CASCADE, -- Référence au rôle
    availability    VARCHAR(15) NOT NULL CHECK (availability IN ('immediate', 'within_week', 'within_month')), -- Disponibilité
    status          VARCHAR(15) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')), -- Statut de la candidature
    reviewed_by     UUID REFERENCES users(id) ON DELETE SET NULL, -- Référence à l'utilisateur qui a examiné la candidature
    review_message  VARCHAR(500), -- Message de révision
    applied_at      TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Date de candidature
    reviewed_at     TIMESTAMP WITH TIME ZONE, -- Date de révision
     portfolio_links     JSONB, -- Array d'URLs
    UNIQUE(user_id, project_role_id), -- Assure qu'un utilisateur ne peut pas postuler plusieurs fois au même rôle
    CONSTRAINT chk_review_timing CHECK (reviewed_at >= applied_at OR reviewed_at IS NULL) -- Vérifie que la date de révision est postérieure à la date de candidature
);
```

#### **team_members**

```sql
CREATE TABLE team_members (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Identifiant unique du membre
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Référence à l'utilisateur
    project_id          UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, -- Référence au projet
    project_role_id     UUID NOT NULL REFERENCES project_roles(id) ON DELETE CASCADE, -- Référence au rôle
    status              VARCHAR(15) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'left')), -- Statut du membre
    contributions_count INTEGER DEFAULT 0 CHECK (contributions_count >= 0), -- Nombre de contributions
    joined_at           TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Date d'adhésion
    left_at             TIMESTAMP WITH TIME ZONE, -- Date de départ

    UNIQUE(user_id, project_id), -- Assure qu'un utilisateur ne peut pas être membre de plusieurs projets en même temps
    CONSTRAINT chk_leave_timing CHECK (left_at >= joined_at OR left_at IS NULL) -- Vérifie que la date de départ est postérieure à la date d'adhésion
);
```

---

### **🎯 Tables de Contribution**

#### **good_first_issues**

```sql
CREATE TABLE good_first_issues (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Identifiant unique de l'issue
    project_id       UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, -- Référence au projet
    created_by       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Référence à l'utilisateur qui a créé l'issue
    title            VARCHAR(200) NOT NULL, -- Titre de l'issue
    description      TEXT NOT NULL, -- Description de l'issue
    github_issue_url VARCHAR(500), -- URL de l'issue GitHub
    estimated_time   VARCHAR(10) CHECK (estimated_time IN ('30min', '1h', '2h', '4h', '1day')), -- Temps estimé
    difficulty       VARCHAR(15) NOT NULL CHECK (difficulty IN ('very_easy', 'easy', 'medium')), -- Difficulté de l'issue
    status           VARCHAR(15) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'completed', 'closed')), -- Statut de l'issue
    assigned_to      UUID REFERENCES users(id) ON DELETE SET NULL, -- Référence à l'utilisateur assigné
    is_ai_generated  BOOLEAN DEFAULT false, -- Indique si l'issue a été générée par l'IA
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Date de création
    completed_at     TIMESTAMP WITH TIME ZONE, -- Date de complétion

    CONSTRAINT chk_completion_timing CHECK (completed_at >= created_at OR completed_at IS NULL) -- Vérifie que la date de complétion est postérieure à la date de création
);
```

#### **issue_skills**

```sql
CREATE TABLE issue_skills (
    id         UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Identifiant unique de la compétence d'issue
    issue_id   UUID NOT NULL REFERENCES good_first_issues(id) ON DELETE CASCADE, -- Référence à l'issue
    skill_id   UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE, -- Référence à la compétence
    is_primary BOOLEAN DEFAULT false, -- Indique si c'est une compétence principale

    UNIQUE(issue_id, skill_id) -- Assure qu'une issue ne peut pas avoir la même compétence en double
);
```

#### **contributions**

```sql
CREATE TABLE contributions (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Identifiant unique de la contribution
    user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- Référence à l'utilisateur
    project_id    UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, -- Référence au projet
    issue_id      UUID REFERENCES good_first_issues(id) ON DELETE SET NULL, -- Référence à l'issue
    type          VARCHAR(20) NOT NULL CHECK (type IN ('code', 'design', 'documentation', 'bug_fix', 'feature', 'other')), -- Type de contribution
    title         VARCHAR(200) NOT NULL, -- Titre de la contribution
    description   TEXT, -- Description de la contribution
    github_pr_url VARCHAR(500), -- URL de la pull request GitHub
    status        VARCHAR(15) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'merged', 'rejected')), -- Statut de la contribution
    reviewed_by   UUID REFERENCES users(id) ON DELETE SET NULL, -- Référence à l'utilisateur qui a examiné la contribution
    submitted_at  TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Date de soumission
    merged_at     TIMESTAMP WITH TIME ZONE, -- Date de fusion

    CONSTRAINT chk_merge_timing CHECK (merged_at >= submitted_at OR merged_at IS NULL) -- Vérifie que la date de fusion est postérieure à la date de soumission
);
```

---

### **🔧 Tables de Support**

#### **linked_repositories**

```sql
CREATE TABLE linked_repositories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Identifiant unique du dépôt lié
    project_id  UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE, -- Référence au projet
    github_url  VARCHAR(500) NOT NULL, -- URL du dépôt GitHub
    name        VARCHAR(100) NOT NULL, -- Nom du dépôt
    description VARCHAR(500), -- Description du dépôt
    is_main     BOOLEAN DEFAULT false, -- Indique si c'est le dépôt principal
    language    VARCHAR(50), -- Langage de programmation
    stars_count INTEGER DEFAULT 0 CHECK (stars_count >= 0), -- Nombre d'étoiles
    last_sync   TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Date de dernière synchronisation

    UNIQUE(project_id, github_url) -- Assure qu'un projet ne peut pas avoir le même dépôt en double
);
```

---

## 🚀 Index et Optimisations

### **Index Principaux (MVP)**

```sql
-- Index pour les recherches fréquentes
CREATE INDEX idx_users_username ON users(username); -- Index sur le nom d'utilisateur
CREATE INDEX idx_users_github_username ON users(github_username) WHERE github_username IS NOT NULL; -- Index sur le nom d'utilisateur GitHub
CREATE INDEX idx_users_level ON users(level); -- Index sur le niveau de l'utilisateur
CREATE INDEX idx_users_contribution_score ON users(contribution_score DESC); -- Index sur le score de contribution

-- Index pour les projets
CREATE INDEX idx_projects_owner_id ON projects(owner_id); -- Index sur l'ID du propriétaire du projet
CREATE INDEX idx_projects_status ON projects(status); -- Index sur le statut du projet
CREATE INDEX idx_projects_difficulty ON projects(difficulty); -- Index sur la difficulté du projet
CREATE INDEX idx_projects_seeking ON projects(is_seeking_contributors) WHERE is_seeking_contributors = true; -- Index sur les projets recherchant des contributeurs

-- Index pour les compétences
CREATE INDEX idx_skills_category_id ON skills(skill_category_id); -- Index sur l'ID de la catégorie de compétence

-- Index composés pour les relations
CREATE INDEX idx_user_skills_user_skill ON user_skills(user_id, skill_id); -- Index sur l'utilisateur et la compétence
CREATE INDEX idx_project_role_skills_role_skill ON project_role_skills(project_role_id, skill_id); -- Index sur le rôle et la compétence
CREATE INDEX idx_applications_status_date ON applications(status, applied_at); -- Index sur le statut et la date de candidature
CREATE INDEX idx_team_members_project_status ON team_members(project_id, status); -- Index sur le projet et le statut du membre

-- Index pour les contributions
CREATE INDEX idx_contributions_user_project ON contributions(user_id, project_id); -- Index sur l'utilisateur et le projet
CREATE INDEX idx_contributions_project_status ON contributions(project_id, status); -- Index sur le projet et le statut de la contribution
CREATE INDEX idx_good_first_issues_project_status ON good_first_issues(project_id, status); -- Index sur le projet et le statut de l'issue
```

### **Index de Performance (MVP)**

```sql
-- Index pour l'algorithme de matching
CREATE INDEX idx_matching_user_skills ON user_skills(skill_id, proficiency_level) WHERE proficiency_level IN ('intermediate', 'advanced', 'expert'); -- Index pour le matching des compétences utilisateur
CREATE INDEX idx_matching_project_skills ON project_role_skills(skill_id, proficiency_level, is_required); -- Index pour le matching des compétences de projet

-- Index pour les tableaux de bord
CREATE INDEX idx_dashboard_user_applications ON applications(user_id, status, applied_at DESC); -- Index pour les candidatures utilisateur
CREATE INDEX idx_dashboard_user_contributions ON contributions(user_id, submitted_at DESC); -- Index pour les contributions utilisateur
CREATE INDEX idx_dashboard_project_members ON team_members(project_id, status, joined_at DESC); -- Index pour les membres du projet
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
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); -- Trigger pour mettre à jour la date de mise à jour des utilisateurs
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); -- Trigger pour mettre à jour la date de mise à jour des projets
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); -- Trigger pour mettre à jour la date de mise à jour des compétences
CREATE TRIGGER update_skill_categories_updated_at BEFORE UPDATE ON skill_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); -- Trigger pour mettre à jour la date de mise à jour des catégories de compétences
```

### **Contraintes Métier**

```sql
-- Empêcher les candidatures sur ses propres projets
ALTER TABLE applications ADD CONSTRAINT chk_no_self_application
CHECK (user_id != (SELECT owner_id FROM projects p JOIN project_roles pr ON p.id = pr.project_id WHERE pr.id = project_role_id)); -- Vérifie qu'un utilisateur ne peut pas postuler à son propre projet

-- Vérifier que les issues assignées le sont à des membres du projet
ALTER TABLE good_first_issues ADD CONSTRAINT chk_assigned_to_member
CHECK (assigned_to IS NULL OR EXISTS (
    SELECT 1 FROM team_members tm
    WHERE tm.user_id = assigned_to
    AND tm.project_id = good_first_issues.project_id
    AND tm.status = 'active'
)); -- Vérifie qu'une issue assignée l'est à un membre actif du projet
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
GROUP BY p.id, u.username; -- Vue enrichie des projets avec des statistiques
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
GROUP BY u.id, u.username, u.contribution_score; -- Vue des statistiques utilisateur
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
INSERT INTO skill_categories (name, description) VALUES
('Frontend', 'Technologies de développement front-end'),
('Backend', 'Technologies de développement back-end'),
('Design', 'Compétences en design et UX/UI'),
('DevOps', 'Outils et pratiques DevOps'),
('Mobile', 'Développement d\'applications mobiles'),
('Marketing', 'Marketing digital et growth'),
('Data', 'Data Science et Analytics'),
('Other', 'Autres compétences');
```

---

## 🔄 Champs Future Supprimés

### **Tables Simplifiées pour MVP**

**skill_categories** - Supprimés :

- `color` : Couleur hexadécimale (UI non prioritaire)
- `sort_order` : Ordre d'affichage (ORDER BY name suffit)
- `is_active` : Gestion activité (pas critique MVP)

**skills** - Supprimés :

- `color` : Couleur hexadécimale (UI non prioritaire)
- `popularity_score` : Score calculable plus tard avec vraies données
- `is_active` : Gestion activité (toutes actives par défaut)

**project_roles** - Supprimés :

- `is_remote_friendly` : Non pertinent pour open source (remote by default)

**user_skills** - Supprimés :

- `years_experience` : Complexité inutile pour MVP
- `endorsed_count` : Feature type LinkedIn, pas prioritaire
- `last_used` : Tracking trop fin pour MVP

**applications** - Supprimés :

- `portfolio_links` : JSON complexe, portfolio_url dans User suffit
- `motivation_message` : À discuter avec équipe (friction vs qualité)

### 🟡 Point de Discussion Équipe

**applications.motivation_message** :

- **Argument pour** : Améliore la qualité des candidatures, aide les owners à choisir
- **Argument contre** : Ajoute de la friction, peut décourager candidatures spontanées
- **Options** :
  1. Obligatoire pour tous
  2. Optionnel pour tous
  3. Configurable par project owner
- **Recommandation** : Commencer optionnel, analyser l'usage, puis décider

---

_Ce MLD MVP optimisé permet un lancement rapide avec les fonctionnalités essentielles, tout en gardant une structure évolutive pour les futures améliorations._
-->