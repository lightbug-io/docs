import{v as k,ar as p,z as n,J as E,A as l,u as r,K as s,y as i,C as d,c as y,ag as g}from"./chunks/framework.C80sNVRy.js";import{_ as c,A as o}from"./chunks/ApiReference.vue_vue_type_script_setup_true_lang.ea8yUphO.js";import{l as F}from"./chunks/load.B2aKF3la.js";import"./chunks/theme.BUbyoYV_.js";const B=JSON.parse('{"title":"","description":"","frontmatter":{"aside":false,"outline":false,"pageClass":"api-reference-page"},"headers":[],"params":{"operationId":"post-users-refreshToken","pageTitle":"Version 2: Refresh token"},"relativePath":"apis/v2/post-users-refreshToken.md","filePath":"apis/v2/[operationId].md"}'),m={name:"apis/v2/post-users-refreshToken.md"},b=k({...m,setup(u){const t=F(2,g),h=p(),e=y(()=>h.data.params.operationId);return(A,a)=>(n(),E("div",{"data-pagefind-body":!0,"data-pagefind-meta":"date:NaN"},[(n(),l(c,{key:e.value,"operation-id":e.value,spec:r(t)},null,8,["operation-id","spec"])),a[1]||(a[1]=s("h2",{id:"openapi-definition",tabindex:"-1"},[i("OpenAPI definition "),s("a",{class:"header-anchor",href:"#openapi-definition","aria-label":'Permalink to "OpenAPI definition"'},"​")],-1)),(n(),l(o,{version:2,key:e.value},{default:d(()=>[...a[0]||(a[0]=[s("div",{class:"api-yaml-document","data-yaml":`info:
  title: Lightbug API
  version: '2'
externalDocs:
  description: ''
  url: ''
openapi: 3.1.0
servers:
  - url: https://api.lightbug.cloud/v2
tags: []
paths:
  /users/refreshToken:
    post:
      description: Refresh the access token and refresh token that was retrieved during login.
      requestBody:
        content:
          application/json:
            schema:
              properties:
                accessToken:
                  description: Current access token (may be expired)
                  type: string
                refreshToken:
                  description: Current refresh token
                  type: string
                refreshable:
                  description: A new refresh token will be generated, with an expiry this many seconds after the access token expiry. Max 31 days
                  maximum: 2678400
                  type: integer
              required:
                - accessToken
                - refreshToken
                - refreshable
              type: object
        description: RefreshToken
        required: true
      responses:
        '200':
          content:
            application/json:
              schema:
                properties:
                  expiry:
                    description: Expiry of the access token
                    type: string
                  refreshToken:
                    description: Single use refresh token
                    type: string
                  refreshTokenExpiry:
                    description: Expiry of the refresh token
                    type: string
                  token:
                    description: JWT access token
                    type: string
                  userId:
                    description: User ID of the logged in user
                    type: integer
                required:
                  - expiry
                  - refreshToken
                  - refreshTokenExpiry
                  - token
                  - userId
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
        '500':
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
          description: Internal Server Error
      summary: Refresh token
      tags:
        - auth
      operationId: post-users-refreshToken
`},[s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"info"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"  title"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Lightbug API")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"  version"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"'2'")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"externalDocs"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"  description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"''")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"  url"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"''")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"openapi"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"3.1.0")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"servers"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"  - "),s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"url"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"https://api.lightbug.cloud/v2")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"tags"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": []")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"paths"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"  /users/refreshToken"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"    post"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Refresh the access token and refresh token that was retrieved during login.")])])])])]),s("details",{class:"api-yaml-fold",open:""},[s("summary",{style:{"--api-yaml-indent":"6ch"}},[s("code",{class:"api-yaml-source","v-pre":""},"requestBody:")]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"        content"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          application/json"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            schema"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"              properties"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                accessToken"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Current access token (may be expired)")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"string")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                refreshToken"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Current refresh token")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"string")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                refreshable"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"A new refresh token will be generated, with an expiry this many seconds after the access token expiry. Max 31 days")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  maximum"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"2678400")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"integer")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"              required"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"                - "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"accessToken")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"                - "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"refreshToken")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"                - "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"refreshable")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"              type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"object")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"        description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"RefreshToken")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"        required"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"true")])])])])])]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      responses"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")])])])])]),s("details",{class:"api-yaml-fold",open:""},[s("summary",{style:{"--api-yaml-indent":"8ch"}},[s("code",{class:"api-yaml-source","v-pre":""},"'200':")]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          content"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            application/json"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"              schema"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                properties"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  expiry"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Expiry of the access token")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"string")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  refreshToken"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Single use refresh token")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"string")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  refreshTokenExpiry"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Expiry of the refresh token")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"string")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  token"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"JWT access token")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"string")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  userId"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"User ID of the logged in user")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"integer")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                required"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"                  - "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"expiry")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"                  - "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"refreshToken")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"                  - "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"refreshTokenExpiry")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"                  - "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"token")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"                  - "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"userId")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"object")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"OK")])])])])])]),s("details",{class:"api-yaml-fold",open:""},[s("summary",{style:{"--api-yaml-indent":"8ch"}},[s("code",{class:"api-yaml-source","v-pre":""},"'400':")]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          content"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            application/json"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"              schema"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                properties"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  code"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    example"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"400")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"integer")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  message"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    example"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"status bad request")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"string")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"object")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Bad Request")])])])])])]),s("details",{class:"api-yaml-fold",open:""},[s("summary",{style:{"--api-yaml-indent":"8ch"}},[s("code",{class:"api-yaml-source","v-pre":""},"'401':")]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          content"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            application/json"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"              schema"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                properties"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  code"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    example"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"400")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"integer")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  message"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    example"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"status bad request")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"string")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"object")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Unauthorized")])])])])])]),s("details",{class:"api-yaml-fold",open:""},[s("summary",{style:{"--api-yaml-indent":"8ch"}},[s("code",{class:"api-yaml-source","v-pre":""},"'429':")]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          content"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
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
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"integer")])])])])])]),s("details",{class:"api-yaml-fold",open:""},[s("summary",{style:{"--api-yaml-indent":"8ch"}},[s("code",{class:"api-yaml-source","v-pre":""},"'500':")]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          content"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"            application/json"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"              schema"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                properties"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  code"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    example"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#005CC5","--shiki-dark":"#79B8FF"}},"400")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"integer")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                  message"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    example"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"status bad request")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                    type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"string")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"                type"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"object")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"          description"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Internal Server Error")])])])])])]),s("div",{class:"api-yaml-chunk"},[s("div",{class:"language-yaml vp-adaptive-theme"},[s("button",{title:"Copy Code",class:"copy"}),s("span",{class:"lang"},"yaml"),s("pre",{class:"shiki shiki-themes github-light github-dark vp-code",tabindex:"0","v-pre":""},[s("code",null,[s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      summary"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"Refresh token")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      tags"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},":")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},"        - "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"auth")]),i(`
`),s("span",{class:"line"},[s("span",{style:{"--shiki-light":"#22863A","--shiki-dark":"#85E89D"}},"      operationId"),s("span",{style:{"--shiki-light":"#24292E","--shiki-dark":"#E1E4E8"}},": "),s("span",{style:{"--shiki-light":"#032F62","--shiki-dark":"#9ECBFF"}},"post-users-refreshToken")])])])])])],-1)])]),_:1}))]))}});export{B as __pageData,b as default};
