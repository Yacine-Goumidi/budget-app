# Budget App

**Une application de gestion de budget et de liste de courses, fullstack React + backend, avec génération de PDF.**

---

## 📌 Description

Cette application permet de gérer un budget et une liste de courses de manière dynamique et intuitive.  
Les utilisateurs peuvent :  
- Définir un budget initial  
- Ajouter des produits avec prix, quantité, type et réduction  
- Filtrer les produits par catégorie (Alimentation, Vêtements, Sport, Maison…)  
- Voir le total en temps réel et savoir si le budget est respecté  
- Exporter la liste de courses en PDF propre et lisible  
- (Option future) Créer un compte et sauvegarder l’historique

L’objectif est de fournir un **outil concret et utilisable** qui met en avant la gestion d’état complexe et la persistance des données.

---

## ⚙️ Fonctionnalités clés

- **Gestion de budget dynamique** : calcul automatique des totaux et des réductions  
- **Liste de courses interactive** : ajout, modification et suppression des produits  
- **Filtres par catégorie**  
- **Export PDF** avec date, total et produits  
- **Responsive** : utilisable sur desktop et mobile  
- **Architecture fullstack** : possibilité de connecter à un backend pour l’authentification et l’historique  

---

## 🛠 Stack technique

**Frontend :**  
- React + Vite  
- React Router  
- Context API pour la gestion globale de l’état  
- CSS responsive  
- jsPDF + jsPDF-AutoTable pour l’export PDF  

**Backend (optionnel / futur) :**  
- Node.js + Express  
- PostgreSQL ou MongoDB  
- JWT pour l’authentification  
- API REST pour la gestion des utilisateurs et des listes  

---

## 🚀 Installation

1. Cloner le projet :  
```bash
git clone https://github.com/Yacine-Goumidi/budget-app.git