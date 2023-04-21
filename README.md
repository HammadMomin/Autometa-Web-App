# Autometa Corporation Web Application

Below Are the Steps to Run This Application On your System
--------------------------------------------------------------------
Step 1 : To clone the repository, use the following command:

```
git clone https://github.com/HammadMomin/Autometa-Web-App.git
```
Step 2 : Go to project directory folder and run this Command. This Command May Not Work if your Machine does not have Node. First install it from  https://nodejs.org/en/download.  Add ‪C:\Program Files\nodejs\npm to your System Environment Variables Inside The Path. Now, you are Good to Run this Command 

```
npm i install
```
This Above Command Will Install the node_modules. 

Step 3 : Finally to Run This Web Application. Run the Following Command given Below

```
npm run dev
```
This will Run The Web Application on localhost:5000

**alt-NOTE :** This Application Allows to Signup, Login, Choose File and  Upload .pdf/.doc/.txt files and Also allows User to Fire a Query with reference to document Uploaded by the user. For The Summarization Part You Need to Make Another Setup From where the NLP Model Is Running Locally on Flask Server using Papermill Library 
For More Info Just Head Over to this repository and Install it by refering To its Respective README file. 

After Installing Both, You Need To run the Flask Server And NodeJs Server Simultaneosly 
