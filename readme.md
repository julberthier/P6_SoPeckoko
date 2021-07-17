*****************Pour utiliser le backend :*****************

Cloner le repos d'origine https://github.com/OpenClassrooms-Student-Center/dwj-projet6
puis cloner le backend dans un dossier backend/

*********************Pour faire fonctionner le projet, vous devez installer :*********************

NodeJS en version 14.16.1.
Angular CLI en version 7.0.2.
node-sass : attention à prendre la version correspondante à NodeJS. Pour Node 14.0 par exemple, installer node-sass en version 4.14+.
Sur Windows, ces installations nécessitent d'utiliser PowerShell en tant qu'administrateur.

*****************Development server*****************

Démarrer ng serve pour avoir accès au serveur de développement. Rendez-vous sur http://localhost:4200/. L'application va se recharger automatiquement si vous modifiez un fichier source.

Creer un fichier .env avec les données suivantes :

DB_USER=examinateur 	
DB_PASS=Hello76-

MONGO_URI=mongodb+srv://examinateur:Hello76-@cluster0.taycp.mongodb.net/dbpeckoko?retryWrites=true

SECRET_KEY=NTCV36EE5AFC5FX352

CRYPT_KEY = 16Vx2P32TlX33C557cP2MO8HmMWFVufr​
