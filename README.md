# AIFSD Workshop 

This hands-on builds a **real-world enterprise app** and shows how **AI-First Software Development (AIFSD)** fits into each stage. 

Verify versions (run in a terminal/PowerShell)

```
dotnet --list-sdks        # confirm 9.x is listed
dotnet --info
node -v                   # LTS recommended
npm -v
code --version            # VS Code
```

## What We’ll Build (at a glance)

- **Back end:** ASP.NET Core 9 API scaffold (Aventude Citrus65 template)
    
- **Front end:** React client scaffold (Aventude Citrus65 client)
    
- **AIFSD touchpoints:** AI-assisted user stories → API design → code scaffolding → tests → docs → PRs


## Create the Project Scaffolds

> Choose a working folder (e.g., `C:\AIFSD\session001` or `~/aifsd/session001`).

### Back end

**Install the template (one-time):**

`dotnet new install Aventude.Templates.Citrus65`

**Option A – Visual Studio (Windows):**

1. **File → New → Project**
    
2. Search for **“Citrus”** → select the **Citrus65** template.
    
3. Name it: `Session001` → Create.
    

**Option B – CLI (any OS):**

`dotnet new citrus65 -n "Session001"`

**Run the API (from the API project folder):**

`dotnet restore dotnet build dotnet watch run`

- Note the console output for the **HTTP/HTTPS URLs** (e.g., http://localhost:5074/).
    
- Test quickly in a browser or with curl/Postman.
    

### Front end

From your workspace (parallel to the API folder or inside it—your choice):

```
npm create aventude-citrus65client@latest session001-fe 

cd session001-fe 

npm install   # if the create step didn’t auto-install`

**Run the client:**

`npm start   # common for Vite setups # or npm start     # common for CRA`

```

> If unsure, open `package.json` and use whichever script exists.


### Connect Front end ↔ Back end

When we develop front end user story we will specify the API Base URL.


## AIFSD Workflow During the Lab

1. **Problem framing & user stories**
    
    - Use AI to draft/clarify user stories and acceptance criteria.
        
2. **API design (contract-first)**
    
    - Prompt AI to propose endpoints & data contracts → review & refine.
        
3. **Code scaffolding**
    
    - Generate controllers/handlers/models/tests from the contract.
        
4. **Tests first**
    
    - Use AI to draft unit/integration test skeletons.
        
5. **Docs & developer experience**
    
    - Generate README/API docs from code & OpenAPI.
        
6. **Commit hygiene & PR reviews**
    
    - Use AI to summarize changes, write PR descriptions, and checklist items.

### Database connection strings

1. Server=uom-wo01.database.windows.net;Initial Catalog=binarybeasts;Persist Security Info=True;User ID=dbadmin;Password=Iz9z%l@p2t&gJMP7Z.r;Pooling=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Command Timeout=180

2. Server=uom-wo01.database.windows.net;Initial Catalog=bytebuilders;Persist Security Info=True;User ID=dbadmin;Password=Iz9z%l@p2t&gJMP7Z.r;Pooling=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Command Timeout=180

3. Server=uom-wo01.database.windows.net;Initial Catalog=codecrusaders;Persist Security Info=True;User ID=dbadmin;Password=Iz9z%l@p2t&gJMP7Z.r;Pooling=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Command Timeout=180

4. Server=uom-wo01.database.windows.net;Initial Catalog=debugdragons;Persist Security Info=True;User ID=dbadmin;Password=Iz9z%l@p2t&gJMP7Z.r;Pooling=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Command Timeout=180

5. Server=uom-wo01.database.windows.net;Initial Catalog=hackheroes;Persist Security Info=True;User ID=dbadmin;Password=Iz9z%l@p2t&gJMP7Z.r;Pooling=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Command Timeout=180

6. Server=uom-wo01.database.windows.net;Initial Catalog=logiclegends;Persist Security Info=True;User ID=dbadmin;Password=Iz9z%l@p2t&gJMP7Z.r;Pooling=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Command Timeout=180

7. Server=uom-wo01.database.windows.net;Initial Catalog=pixelpoineers;Persist Security Info=True;User ID=dbadmin;Password=Iz9z%l@p2t&gJMP7Z.r;Pooling=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Command Timeout=180

8. Server=uom-wo01.database.windows.net;Initial Catalog=stackoverflow;Persist Security Info=True;User ID=dbadmin;Password=Iz9z%l@p2t&gJMP7Z.r;Pooling=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Command Timeout=180

9. Server=uom-wo01.database.windows.net;Initial Catalog=syntaxsquad;Persist Security Info=True;User ID=dbadmin;Password=Iz9z%l@p2t&gJMP7Z.r;Pooling=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Command Timeout=180

10. Server=uom-wo01.database.windows.net;Initial Catalog=uom-wo01;Persist Security Info=True;User ID=dbadmin;Password=Iz9z%l@p2t&gJMP7Z.r;Pooling=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Command Timeout=180

11. Server=uom-wo01.database.windows.net;Initial Catalog=vibevampires;Persist Security Info=True;User ID=dbadmin;Password=Iz9z%l@p2t&gJMP7Z.r;Pooling=False;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=True;Command Timeout=180


### API Key 

sk-proj-M1I2QWo7PzR1e2g3Syw3byJRfdQVG_9h1CHEPkU_rV29Ls_Xlm0YuFkRHmThHO0jKGaUhiqH22T3BlbkFJ9PKb3tuObFMWP1AMhstvf2nwsLE7LHm57S-irXdsrj_KLJRhOQuWJFtU_t3Oj_e_uuFVm

    

