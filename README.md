# AIFSD Workshop

During the workshop there will be an interactive hands-on session in AIFSD (AI First Software Development). In this session you will developing a real-world enterprise application and experience how AIFSD is applied in different stages of development. 

## Create the Project Scaffolds

Choose a working folder (e.g., C:\AIFSD\session001 or ~/aifsd/session001).

### Back end

Install the template (one-time):

`dotnet new install Aventude.Templates.Citrus65`

Option A – Visual Studio (Windows):

File → New → Project

Search for “Citrus” → select the Citrus65 template.

Name it: Session001 → Create.

Option B – CLI (any OS):

`dotnet new citrus65 -n "Session001"`
`
dotnet restore
dotnet build
dotnet watch run
`
http://localhost:5074/swagger


