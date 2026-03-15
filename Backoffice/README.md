## iO Event Connect – Backoffice (Frontend)

### Packages
- React
- React Router
- shadcn/ui

### Projectstructuur
```
├── public/         # Alle source bestanden
├── app/            # In veel talen de src-folder
    ├── components/             # Components die voor de hele app gebruikt worden
        ├── ui/                     # Componenten uit shadcn/ui, hoef je waarschijnlijk niet te wijzigen
    ├── routes/
        ├── [module]/           # Bijvoorbeeld: events
            ├── components/                 # Component enkel gebruikt door deze module
            ├── [module].[pagina].tsx       # Bestand per pagina
    ├── routes.ts     # Route configuratie
    
```

### Editor setup
Dit project maakt gebruik van Eslint en Prettier. In de meeste editors is deze configuratie al ingesteld.
> Tip: zet bij "actions on save": "run prettier" en "run eslint --fix" aan
