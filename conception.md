### 📘 Dictionnaire de données — Open Source Together (Version 2.0)

#### 🔹 Utilisateur (User)

| Nom                | Type       | Description                             | Valeurs possibles                      | Contraintes                  |
| ------------------ | ---------- | --------------------------------------- | -------------------------------------- | ---------------------------- |
| id_user            | UUID       | Identifiant unique utilisateur          | UUID                                   | PK, unique                   |
| username           | Texte      | Nom d'utilisateur affiché               | Max 30 caractères                      | Obligatoire, unique          |
| email              | Texte      | Adresse email                           | Format email                           | Obligatoire, unique          |
| bio                | Texte      | Bio de l'utilisateur                    | Max 500 caractères                     | Optionnel                    |
| github_username    | Texte      | Nom d'utilisateur GitHub                | Max 39 caractères                      | Optionnel, unique si présent |
| linkedin_url       | Texte      | URL du profil LinkedIn                  | Format URL                             | Optionnel                    |
| github_url         | Texte      | URL du profil Github                    | Format URL                             | Optionnel                    |
| portfolio_url      | Texte      | URL du portfolio personnel              | Format URL                             | Optionnel                    |
| contribution_score | Entier     | Score basé sur les contributions        | ≥ 0                                    | Automatique, calculé         |
| level              | Texte      | Niveau d'expérience                     | "beginner", "intermediate", "advanced" | Enum, défaut: "beginner"     |
| is_open_to_hire    | Booléen    | Ouvert aux opportunités de contribution | true/false                             | Défaut: false                |
| location           | Texte      | Localisation géographique               | Max 100 caractères                     | Optionnel                    |
| timezone           | Texte      | Fuseau horaire                          | Format IANA (ex: "Europe/Paris")       | Optionnel                    |
| created_at         | Date/Heure | Date de création du compte              | ISO 8601                               | Automatique                  |
| updated_at         | Date/Heure | Dernière mise à jour                    | ISO 8601                               | Automatique                  |

#### 🔹 Projet (Project)

| Nom                     | Type       | Description                          | Valeurs possibles                                      | Contraintes               |
| ----------------------- | ---------- | ------------------------------------ | ------------------------------------------------------ | ------------------------- |
| id_project              | UUID       | Identifiant du projet                | UUID                                                   | PK, unique                |
| owner_id                | UUID       | Propriétaire du projet               | Référence User                                         | FK vers User, obligatoire |
| title                   | Texte      | Titre du projet                      | Max 100 caractères                                     | Obligatoire               |
| description             | Texte      | Description complète du projet       | Max 2000 caractères                                    | Obligatoire               |
| vision                  | Texte      | Vision et objectifs du projet        | Max 1000 caractères                                    | Obligatoire               |
| github_main_repo        | Texte      | Repository principal GitHub          | URL                                                    | Obligatoire               |
| website_url             | Texte      | Site web du projet                   | URL                                                    | Optionnel                 |
| documentation_url       | Texte      | URL de la documentation              | URL                                                    | Optionnel                 |
| difficulty              | Texte      | Niveau de difficulté global          | "easy", "medium", "hard"                               | Enum, obligatoire         |
| status                  | Texte      | État du projet                       | "active", "paused", "completed", "archived"            | Enum, obligatoire         |
| is_seeking_contributors | Booléen    | Cherche activement des contributeurs | true/false                                             | Défaut: true              |
| project_type            | Texte      | Type de projet                       | "library", "application", "tool", "framework", "other" | Enum                      |
| license                 | Texte      | Licence du projet                    | "MIT", "Apache-2.0", "GPL-3.0", "custom", "other"      | Enum                      |
| stars_count             | Entier     | Nombre d'étoiles GitHub              | ≥ 0                                                    | Automatique, synchronisé  |
| contributors_count      | Entier     | Nombre de contributeurs actifs       | ≥ 0                                                    | Calculé                   |
| created_at              | Date/Heure | Date de création                     | ISO 8601                                               | Automatique               |
| updated_at              | Date/Heure | Dernière mise à jour                 | ISO 8601                                               | Automatique               |

#### 🔹 Catégorie de Compétence (SkillCategory)

| Nom          | Type       | Description                        | Valeurs possibles                                    | Contraintes         |
| ------------ | ---------- | ---------------------------------- | ---------------------------------------------------- | ------------------- |
| id_category  | UUID       | Identifiant de la catégorie        | UUID                                                 | PK, unique          |
| name         | Texte      | Nom de la catégorie                | "Frontend", "Backend", "Design", "Marketing", etc.  | Obligatoire, unique |
| description  | Texte      | Description de la catégorie        | Max 500 caractères                                   | Optionnel           |
| icon_url     | Texte      | URL de l'icône de la catégorie     | Format URL                                           | Optionnel           |
| color        | Texte      | Couleur hexadécimale de la catégorie | Format #RRGGBB                                      | Optionnel           |
| sort_order   | Entier     | Ordre d'affichage                  | ≥ 0                                                  | Défaut: 0           |
| is_active    | Booléen    | Catégorie active                   | true/false                                           | Défaut: true        |
| created_at   | Date/Heure | Date de création                   | ISO 8601                                             | Automatique         |
| updated_at   | Date/Heure | Dernière mise à jour               | ISO 8601                                             | Automatique         |

#### 🔹 Compétence (Skill)

| Nom                | Type       | Description                    | Valeurs possibles                | Contraintes                 |
| ------------------ | ---------- | ------------------------------ | -------------------------------- | --------------------------- |
| id_skill           | UUID       | Identifiant de la compétence   | UUID                             | PK, unique                  |
| skill_category_id  | UUID       | Catégorie de la compétence     | Référence SkillCategory          | FK vers SkillCategory       |
| name               | Texte      | Nom de la compétence           | "React", "UX Design", "SEO", etc.| Obligatoire, unique         |
| description        | Texte      | Description de la compétence   | Max 500 caractères               | Optionnel                   |
| icon_url           | Texte      | URL de l'icône                 | Format URL                       | Optionnel                   |
| color              | Texte      | Couleur hexadécimale           | Format #RRGGBB                   | Optionnel                   |
| is_technical       | Booléen    | Compétence technique ou non    | true/false                       | Défaut: true                |
| popularity_score   | Entier     | Score de popularité            | ≥ 0                              | Calculé automatiquement     |
| is_active          | Booléen    | Compétence active              | true/false                       | Défaut: true                |
| created_at         | Date/Heure | Date de création               | ISO 8601                         | Automatique                 |
| updated_at         | Date/Heure | Dernière mise à jour           | ISO 8601                         | Automatique                 |

#### 🔹 Rôle Projet (ProjectRole)

| Nom                  | Type       | Description                        | Valeurs possibles                     | Contraintes             |
| -------------------- | ---------- | ---------------------------------- | ------------------------------------- | ----------------------- |
| id_project_role      | UUID       | Identifiant du rôle dans un projet | UUID                                  | PK, unique              |
| project_id           | UUID       | Projet concerné                    | Référence Project                     | FK vers Project         |
| title                | Texte      | Titre du rôle                      | "Frontend Lead", "UX Designer"        | Obligatoire             |
| description          | Texte      | Description détaillée du rôle      | Max 1000 caractères                   | Obligatoire             |
| responsibility_level | Texte      | Niveau de responsabilité           | "contributor", "maintainer", "lead"   | Enum                    |
| time_commitment      | Texte      | Engagement temps estimé            | "few_hours", "part_time", "full_time" | Enum                    |
| slots_available      | Entier     | Nombre de places disponibles       | ≥ 0                                   | Obligatoire             |
| slots_filled         | Entier     | Nombre de places occupées          | ≥ 0                                   | Calculé automatiquement |
| is_remote_friendly   | Booléen    | Possible en télétravail            | true/false                            | Défaut: true            |
| experience_required  | Texte      | Expérience requise                 | "none", "some", "experienced"         | Enum                    |
| created_at           | Date/Heure | Date de création du rôle           | ISO 8601                              | Automatique             |

#### 🔹 Compétences Requises pour un Rôle (ProjectRoleSkill)

| Nom               | Type    | Description                           | Valeurs possibles                   | Contraintes         |
| ----------------- | ------- | ------------------------------------- | ----------------------------------- | ------------------- |
| id                | UUID    | Identifiant                           | UUID                                | PK, unique          |
| project_role_id   | UUID    | Rôle concerné                         | Référence ProjectRole               | FK vers ProjectRole |
| skill_id          | UUID    | Compétence requise                    | Référence Skill                     | FK vers Skill       |
| proficiency_level | Texte   | Niveau requis                         | "basic", "intermediate", "advanced" | Enum                |
| is_required       | Booléen | Compétence obligatoire ou optionnelle | true/false                          | Défaut: true        |

#### 🔹 Candidature (Application)

| Nom             | Type       | Description                   | Valeurs possibles                              | Contraintes             |
| --------------- | ---------- | ----------------------------- | ---------------------------------------------- | ----------------------- |
| id_application  | UUID       | Identifiant de la candidature | UUID                                           | PK, unique              |
| user_id         | UUID       | Utilisateur qui postule       | Référence User                                 | FK vers User            |
| project_role_id | UUID       | Rôle auquel il postule        | Référence ProjectRole                          | FK vers ProjectRole     |
| portfolio_links | JSON       | Liens vers portfolio/travaux  | Array d'URLs                                   | Optionnel               |
| availability    | Texte      | Disponibilité                 | "immediate", "within_week", "within_month"     | Enum                    |
| status          | Texte      | Statut de la candidature      | "pending", "accepted", "rejected", "withdrawn" | Enum, obligatoire       |
| reviewed_by     | UUID       | Qui a évalué la candidature   | Référence User                                 | FK vers User, optionnel |
| review_message  | Texte      | Message de retour             | Max 500 caractères                             | Optionnel               |
| applied_at      | Date/Heure | Date de postulation           | ISO 8601                                       | Automatique             |
| reviewed_at     | Date/Heure | Date d'évaluation             | ISO 8601                                       | Optionnel               |

#### 🔹 Membre d'Équipe (TeamMember)

| Nom                 | Type       | Description                    | Valeurs possibles            | Contraintes             |
| ------------------- | ---------- | ------------------------------ | ---------------------------- | ----------------------- |
| id_team_member      | UUID       | Identifiant du membre          | UUID                         | PK, unique              |
| user_id             | UUID       | Utilisateur membre             | Référence User               | FK vers User            |
| project_id          | UUID       | Projet concerné                | Référence Project            | FK vers Project         |
| project_role_id     | UUID       | Rôle dans le projet            | Référence ProjectRole        | FK vers ProjectRole     |
| status              | Texte      | Statut dans l'équipe           | "active", "inactive", "left" | Enum                    |
| contributions_count | Entier     | Nombre de contributions        | ≥ 0                          | Calculé automatiquement |
| joined_at           | Date/Heure | Date d'entrée dans l'équipe    | ISO 8601                     | Automatique             |
| left_at             | Date/Heure | Date de sortie (si applicable) | ISO 8601                     | Optionnel               |

#### 🔹 Good First Issue

| Nom              | Type       | Description                   | Valeurs possibles                                        | Contraintes             |
| ---------------- | ---------- | ----------------------------- | -------------------------------------------------------- | ----------------------- |
| id_issue         | UUID       | Identifiant de l'issue        | UUID                                                     | PK, unique              |
| project_id       | UUID       | Projet concerné               | Référence Project                                        | FK vers Project         |
| created_by       | UUID       | Mainteneur qui a créé l'issue | Référence User                                           | FK vers User            |
| title            | Texte      | Titre de l'issue              | Max 200 caractères                                       | Obligatoire             |
| description      | Texte      | Description détaillée         | Max 2000 caractères                                      | Obligatoire             |
| github_issue_url | Texte      | Lien vers l'issue GitHub      | URL                                                      | Optionnel               |
| estimated_time   | Texte      | Temps estimé                  | "30min", "1h", "2h", "4h", "1day"                        | Enum                    |
| difficulty       | Texte      | Difficulté de l'issue         | "very_easy", "easy", "medium"                            | Enum                    |
| status           | Texte      | État de l'issue               | "open", "assigned", "in_progress", "completed", "closed" | Enum                    |
| assigned_to      | UUID       | Utilisateur assigné           | Référence User                                           | FK vers User, optionnel |
| is_ai_generated  | Booléen    | Issue générée par IA          | true/false                                               | Défaut: false           |
| created_at       | Date/Heure | Date de création              | ISO 8601                                                 | Automatique             |
| completed_at     | Date/Heure | Date de completion            | ISO 8601                                                 | Optionnel               |

#### 🔹 Compétences requises pour une Issue (IssueSkill)

| Nom        | Type    | Description           | Valeurs possibles        | Contraintes            |
| ---------- | ------- | --------------------- | ------------------------ | ---------------------- |
| id         | UUID    | Identifiant           | UUID                     | PK, unique             |
| issue_id   | UUID    | Issue concernée       | Référence GoodFirstIssue | FK vers GoodFirstIssue |
| skill_id   | UUID    | Compétence requise    | Référence Skill          | FK vers Skill          |
| is_primary | Booléen | Compétence principale | true/false               | Défaut: false          |

#### 🔹 Contribution

| Nom             | Type       | Description                    | Valeurs possibles                                                | Contraintes     |
| --------------- | ---------- | ------------------------------ | ---------------------------------------------------------------- | --------------- |
| id_contribution | UUID       | Identifiant de la contribution | UUID                                                             | PK, unique      |
| user_id         | UUID       | Contributeur                   | Référence User                                                   | FK vers User    |
| project_id      | UUID       | Projet concerné                | Référence Project                                                | FK vers Project |
| issue_id        | UUID       | Issue liée (si applicable)     | Référence GoodFirstIssue                                         | FK, optionnel   |
| type            | Texte      | Type de contribution           | "code", "design", "documentation", "bug_fix", "feature", "other" | Enum            |
| title           | Texte      | Titre de la contribution       | Max 200 caractères                                               | Obligatoire     |
| description     | Texte      | Description de la contribution | Max 1000 caractères                                              | Optionnel       |
| github_pr_url   | Texte      | URL de la Pull Request         | URL                                                              | Optionnel       |
| status          | Texte      | Statut de la contribution      | "submitted", "reviewed", "merged", "rejected"                    | Enum            |
| reviewed_by     | UUID       | Reviewer                       | Référence User                                                   | FK, optionnel   |
| submitted_at    | Date/Heure | Date de soumission             | ISO 8601                                                         | Automatique     |
| merged_at       | Date/Heure | Date de merge                  | ISO 8601                                                         | Optionnel       |

#### 🔹 Compétences Utilisateur (UserSkill)

| Nom               | Type    | Description           | Valeurs possibles                                         | Contraintes   |
| ----------------- | ------- | --------------------- | --------------------------------------------------------- | ------------- |
| id                | UUID    | Identifiant           | UUID                                                      | PK, unique    |
| user_id           | UUID    | Utilisateur           | Référence User                                            | FK vers User  |
| skill_id          | UUID    | Compétence            | Référence Skill                                           | FK vers Skill |
| proficiency_level | Texte   | Niveau de maîtrise    | "learning", "basic", "intermediate", "advanced", "expert" | Enum          |
| years_experience  | Entier  | Années d'expérience   | ≥ 0                                                       | Optionnel     |
| is_primary        | Booléen | Compétence principale | true/false                                                | Défaut: false |
| endorsed_count    | Entier  | Nombre d'aprobations  | ≥ 0                                                       | Calculé       |
| last_used         | Date    | Dernière utilisation  | ISO 8601                                                  | Optionnel     |

#### 🔹 Recommandation de Projet (ProjectRecommendation)

| Nom              | Type       | Description                          | Valeurs possibles                                                     | Contraintes      |
| ---------------- | ---------- | ------------------------------------ | --------------------------------------------------------------------- | ---------------- |
| id               | UUID       | Identifiant                          | UUID                                                                  | PK, unique       |
| user_id          | UUID       | Utilisateur ciblé                    | Référence User                                                        | FK vers User     |
| project_id       | UUID       | Projet recommandé                    | Référence Project                                                     | FK vers Project  |
| confidence_score | Décimal    | Score de confiance (0-1)             | 0.0 - 1.0                                                             | Calculé par algo |
| reason           | Texte      | Raison de la recommandation          | "skill_match", "experience_level", "interest", "contribution_history" | Enum             |
| is_viewed        | Booléen    | Recommandation vue par l'utilisateur | true/false                                                            | Défaut: false    |
| is_dismissed     | Booléen    | Recommandation rejetée               | true/false                                                            | Défaut: false    |
| created_at       | Date/Heure | Date de génération                   | ISO 8601                                                              | Automatique      |
| viewed_at        | Date/Heure | Date de visualisation                | ISO 8601                                                              | Optionnel        |

#### 🔹 Repository Lié (LinkedRepository)

| Nom         | Type       | Description                    | Valeurs possibles            | Contraintes     |
| ----------- | ---------- | ------------------------------ | ---------------------------- | --------------- |
| id          | UUID       | Identifiant                    | UUID                         | PK, unique      |
| project_id  | UUID       | Projet parent                  | Référence Project            | FK vers Project |
| github_url  | Texte      | URL du repository              | URL GitHub                   | Obligatoire     |
| name        | Texte      | Nom du repository              | Max 100 caractères           | Obligatoire     |
| description | Texte      | Description du repo            | Max 500 caractères           | Optionnel       |
| is_main     | Booléen    | Repository principal du projet | true/false                   | Défaut: false   |
| language    | Texte      | Langage principal              | "JavaScript", "Python", etc. | Optionnel       |
| stars_count | Entier     | Nombre d'étoiles               | ≥ 0                          | Synchronisé     |
| last_sync   | Date/Heure | Dernière synchronisation       | ISO 8601                     | Automatique     |
