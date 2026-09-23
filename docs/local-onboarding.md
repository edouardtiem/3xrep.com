# Premier parcours sur ordinateur — 23 septembre 2026

Décision : Claude Cowork et ChatGPT Work sur ordinateur d’abord. Pas de projet en nuage comme mémoire de travail du MVP. Le site donne une clé MCP et un premier message à envoyer. Le protocole MCP n’envoie pas de message spontané à la connexion et son serveur distant n’a aucun accès au dossier local.

## Ordre

1. Inscription Beta et clé. Ajouter le connecteur 3xrep dans l’assistant.
2. Ouvrir une tâche locale avec 3xrep activé. Envoyer le premier message du site. L’assistant appelle `start_onboarding`.
3. L’assistant demande le nom d’usage, le poste, le rôle dans l’équipe et le premier besoin. Puis l’entreprise, son offre, ses acheteurs, le cycle de vente et les contraintes connues. Il reformule ; la personne corrige. Il ne réclame pas tout d’un coup et n’invente pas les réponses manquantes.
4. L’assistant demande le dossier local. Certaines applications exigent de le choisir dès l’ouverture de la tâche ; dans ce cas l’assistant le fait confirmer après les questions. La personne l’autorise dans l’application. L’assistant confirme le chemin et crée un sous-dossier `3xrep` après avoir lu les fichiers éventuels. En cas d’échec d’accès ou d’écriture, il le dit et arrête cette étape. Il n’annonce jamais une mémoire créée sans écriture réussie.
5. `person.md` garde le nom, le rôle et les attentes de cette personne. `company.md` garde le contexte confirmé de l’entreprise. `day.md` garde la date, les priorités, les questions ouvertes et les suites. `deals/` garde des résumés courts par affaire. Ni clé, ni transcription complète, ni courriel complet dans ces fichiers. Les faits datés et les citations vérifiées restent distincts des interprétations. L’assistant relit ces fichiers au début d’une nouvelle tâche et les met à jour après un échange utile.
6. Après cela, l’assistant aide à connecter le CRM, les courriels et le calendrier. Il vérifie l’accès réel avant de dire qu’une source est disponible. Les notes apportées dans le chat suffisent pour une première affaire si le CRM manque.

`set_org_profile` ne garde que le site et la description confirmée de l’entreprise. Le rôle et le nom personnels ne vont pas dans le profil commun de l’organisation. La mémoire réduite de 3xrep en base reste séparée des fichiers Markdown locaux : elle retient les trous de preuve par identifiant CRM stable.

## Limite à vérifier dans les applications

Le site et le serveur rendent ce premier geste faisable, mais les instructions MCP ne contraignent pas à elles seules le comportement du modèle ni ses droits sur les fichiers. La validation avant publication doit constater dans chaque application : outil découvert, questions posées, dossier autorisé, vrais fichiers écrits puis relus, connexions disponibles, et premier jugement. Une connexion MCP réussie n’est pas une preuve de ce parcours entier.

Sources officielles : [Claude Cowork et fichiers locaux](https://support.claude.com/en/articles/15520349-use-claude-cowork-on-web-desktop-and-mobile), [ChatGPT Work et dossiers locaux](https://help.openai.com/en/articles/20001275/), [outils et consignes MCP OpenAI](https://developers.openai.com/plugins/build/mcp-server).
