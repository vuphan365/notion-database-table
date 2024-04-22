# Notion Database UI
- This project aims to show dynamic Notion database, which allow to sort, reorder columns and do advanced filters (and, or).
- Database source (allow to edit): https://earthy-zipper-7cf.notion.site/2525bc5e7ee941118a95cdfb6ad4431c?v=a1ebe64ba9d64f35bb3fbd6169747e39&pvs=25
  - Support types: `rich_text`, `title`, `multi_select`, `select`, `status`, `date`, `number`, `checkbox`
  - Other types will be implement in future
- The Github CI/CD flow allow to automatically test and deploy its sub-systems
## Deployment
 - **Frontend**:
	 - Testing
	 - Build
	 - Deploy to AWS S3
	 - Preview URL:  http://notion-database-frontend.s3-website-ap-southeast-1.amazonaws.com/
 - **Backend**
	 - Package and deploy to AWS Lambda
	 - Preview URL: https://xyvmx7ynw4.execute-api.ap-southeast-1.amazonaws.com/prod/database
## Development Setup
### Clone
```bash
git clone https://github.com/vuphan365/notion-database-table.git
```
### Start Backend
```bash
cd backend
touch .env
echo NOTION_SECRET="YOUR_NOTION_SECRET" >> .env
echo NOTION_DATABASE_ID="YOUR_NOTION_DATABASE_ID" >> .env
yarn
yarn run start // Backend will run on localhost:8000
```
### Start Frontend
```bash
cd ../frontend
touch .env
echo VITE_API_HOST="http://localhost:8000" >> .env
yarn
yarn run dev// Frontend will run on http://localhost:5173
```
## Features

 - [x] Build a table view UI for Notion databases
	 - [x] Implement a basic table view given a Notion database as input
	 - [x] Support sorting
	 - [x] Support rearrangement and resizing of columns - expected behavior:
		 - [x] Click and hold the column headings to drag them left or right
		 - [x] Resize columns by hovering over their edges, and dragging right or left
 - [x] Build a Notion filter UI for supporting database filters
	 - [x] Support the property types `checkbox` , `multi_select` ,` number` ,
`select` , `status`
	- [ ] Support the property types `date` , `rich_text` ,` timestamp` 
	- [ ] Support single filter
- [x] Support Compound filters with filter groups
	- [x] Implement the filters such that the restriction on
the levels of nesting is configurable
	- [x]  Implement unit tests for the Compound filters
- [ ] Implement the NOT operator for compound filter conditions.
- [x] CI/CD with GithubAction x AWS

![image](https://github.com/vuphan365/notion-database-table/assets/29919845/47671e31-eaed-45f4-83b3-1accd43fb444)

![image](https://github.com/vuphan365/notion-database-table/assets/29919845/0ecac1d4-5425-44a6-9f8a-e567107e74e5)


## Structure
```
- backend
  - server (main developement)
  - handler (AWS Serverless Lambda)
- frontend
  - src
    - assets
    - components
      - NotionFilterModal
        - CompoundInput
      - NotionProperty
        - NotionDate
        - NotionNumber
        - ....
      - Table
      - ResizeBar
    - mocks
    - hooks
    - services
    - types
    - utils
      - filter
    - App.tsx
- .github
   - workflow
```
## Reference
- https://github.com/NotionX/react-notion-x
- https://tailwindcss.com
- https://developers.notion.com/reference/post-database-query-filter
