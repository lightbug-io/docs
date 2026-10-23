import{v as k,ar as p,z as l,J as E,A as t,u as r,K as s,y as i,C as d,c,ag as y}from"./chunks/framework.C80sNVRy.js";import{_ as g,A as o}from"./chunks/ApiReference.vue_vue_type_script_setup_true_lang.BW76WVe7.js";import{l as m}from"./chunks/load.B2aKF3la.js";import"./chunks/theme.BUbyoYV_.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{"aside":false,"outline":false,"pageClass":"api-reference-page"},"headers":[],"params":{"operationId":"delete-users-personalAccessTokens-id","pageTitle":"Version 2: Delete a personal access token"},"relativePath":"apis/v2/delete-users-personalAccessTokens-id.md","filePath":"apis/v2/[operationId].md"}'),u={name:"apis/v2/delete-users-personalAccessTokens-id.md"},f=k({...u,setup(F){const n=m(2,y),h=p(),e=c(()=>h.data.params.operationId);return(A,a)=>(l(),E("div",{"data-pagefind-body":!0,"data-pagefind-meta":"date:NaN"},[(l(),t(g,{key:e.value,"operation-id":e.value,spec:r(n)},null,8,["operation-id","spec"])),a[1]||(a[1]=s("h2",{id:"openapi-definition",tabindex:"-1"},[i("OpenAPI definition "),s("a",{class:"header-anchor",href:"#openapi-definition","aria-label":'Permalink to "OpenAPI definition"'},"​")],-1)),(l(),t(o,{version:2,key:e.value},{default:d(()=>[...a[0]||(a[0]=[s("div",{class:"api-yaml-document","data-yaml":`info:
  title: Lightbug API
  version: '2'
externalDocs:
  description: ''
  url: ''
openapi: 3.1.0
servers:
  - url: https://api.lightbug.cloud/v2
security:
  - ApiKeyAuth: []
tags: []
paths:
  /users/personalAccessTokens/{id}:
    delete:
      description: Delete a personal access token by ID
      parameters:
        - description: Token ID (Unix timestamp)
          in: path
          name: id
          required: true
          schema:
            type: integer
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
          description: OK
        '400':
          content:
            application/json:
              schema:
                properties:
                  code:
                    example: 400
                    type: integer
                  message:
                    example: status bad request
                    type: string
                type: object
          description: Bad Request
        '401':
          content:
            application/json:
              schema:
                properties:
                  code:
                    example: 400
                    type: integer
                  message:
                    example: status bad request
                    type: string
                type: object
          description: Unauthorized
        '404':
          content:
            application/json:
              schema:
                properties:
                  code:
                    example: 400
                    type: integer
                  message:
                    example: status bad request
                    type: string
                type: object
          description: Not Found
        '429':
          content:
            application/json:
              schema:
                type: string
          description: Limit exceeded
          headers:
            X-Ratelimit-Limit:
              schema:
                type: integer
            X-Ratelimit-Remaining:
              schema:
                type: integer
            X-Ratelimit-Reset:
              schema:
                type: integer
      security:
        - ApiKeyAuth: []
      summary: Delete a personal access token
      tags:
        - personalAccessTokens
      operationId: delete-users-personalAccessTokens-id
components:
  securitySchemes:
    ApiKeyAuth:
      in: header
      name: Authorization
      type: apiKey
      description: API Key for authentication. Retrieval from either API version login routes, or other authentication token type. See <a href='/apis/authentication'>Authentication</a> for more details.
      example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
`},[s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"info"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"  title"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Lightbug API")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"  version"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'2'")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"externalDocs"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"  description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"''")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"  url"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"''")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"openapi"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"3.1.0")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"servers"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"  - "),s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"url"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"https://api.lightbug.cloud/v2")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"security"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"  - "),s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"ApiKeyAuth"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": []")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"tags"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": []")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"paths"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"  /users/personalAccessTokens/{id}"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"    delete"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Delete a personal access token by ID")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      parameters"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        - "),s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Token ID (Unix timestamp)")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          in"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"path")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          name"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"id")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          required"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"true")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          schema"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"integer")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      responses"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")])])])])]),s("details",{class:"api-yaml-fold",open:""},[s("summary",null,[s("code",{class:"api-yaml-source","v-pre":""}," '200':")]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          content"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            application/json"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"              schema"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"object")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"OK")])])])])])]),s("details",{class:"api-yaml-fold",open:""},[s("summary",null,[s("code",{class:"api-yaml-source","v-pre":""}," '400':")]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          content"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            application/json"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"              schema"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")])])])])]),s("details",{class:"api-yaml-fold",open:""},[s("summary",null,[s("code",{class:"api-yaml-source","v-pre":""}," properties:")]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  code"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    example"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"400")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"integer")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  message"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    example"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"status bad request")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"string")])])])])])]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"object")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Bad Request")])])])])])]),s("details",{class:"api-yaml-fold",open:""},[s("summary",null,[s("code",{class:"api-yaml-source","v-pre":""}," '401':")]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          content"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            application/json"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"              schema"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")])])])])]),s("details",{class:"api-yaml-fold",open:""},[s("summary",null,[s("code",{class:"api-yaml-source","v-pre":""}," properties:")]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  code"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    example"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"400")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"integer")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  message"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    example"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"status bad request")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"string")])])])])])]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"object")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Unauthorized")])])])])])]),s("details",{class:"api-yaml-fold",open:""},[s("summary",null,[s("code",{class:"api-yaml-source","v-pre":""}," '404':")]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          content"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            application/json"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"              schema"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")])])])])]),s("details",{class:"api-yaml-fold",open:""},[s("summary",null,[s("code",{class:"api-yaml-source","v-pre":""}," properties:")]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  code"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    example"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"400")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"integer")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  message"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    example"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"status bad request")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"string")])])])])])]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"object")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Not Found")])])])])])]),s("details",{class:"api-yaml-fold",open:""},[s("summary",null,[s("code",{class:"api-yaml-source","v-pre":""}," '429':")]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          content"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            application/json"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"              schema"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"string")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Limit exceeded")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          headers"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            X-Ratelimit-Limit"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"              schema"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"integer")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            X-Ratelimit-Remaining"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"              schema"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"integer")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            X-Ratelimit-Reset"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"              schema"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"integer")])])])])])]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      security"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        - "),s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"ApiKeyAuth"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": []")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      summary"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Delete a personal access token")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      tags"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        - "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"personalAccessTokens")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      operationId"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"delete-users-personalAccessTokens-id")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"components"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"  securitySchemes"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"    ApiKeyAuth"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      in"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"header")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      name"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Authorization")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"apiKey")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"API Key for authentication. Retrieval from either API version login routes, or other authentication token type. See <a href='/apis/authentication'>Authentication</a> for more details.")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      example"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")])])])])])],-1)])]),_:1}))]))}});export{B as __pageData,f as default};
