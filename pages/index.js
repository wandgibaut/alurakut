import React from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import {ProfileRelationsBoxWrapper} from '../src/components/ProfileRelations'
import {AlurakutMenu ,  OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AlurakutCommons'
import nookies from 'nookies'
import jwt from 'jsonwebtoken';

function ProfileSidebar(props){
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} style={{borderRadius: '8px'}}/>
      <hr/>

      <a> {props.name} </a>
      <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
        @{props.githubUser}
      </a>
      <hr/>
      <AlurakutProfileSidebarMenuDefault/>
    </Box>
  )
}


function ProfileRelationsBox(props){
  return (
    <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
          {props.title} ({props.items.length})
          </h2>
          
          <ul>
            {props.items.slice(0, 6).map((item) => {
              
              return (
              <li key={item.login}>
                <a href = {`https://github.com/${item.login}`}> 
                  <img src={`https://github.com/${item.login}.png`}/>
                  <span> {item.login}</span>
                </a>
              </li>
              )
            })}
          </ul>
    </ProfileRelationsBoxWrapper>
  )
}


export default function Home(props) {
  
  const githubUser =  props.githubUser;
  const [name, setName] = React.useState([]);
  //const friends = ['rgudwin', 'andre-paraense', 'estherlc', 'suelenmapa']
  const [following, setFollowing] = React.useState([]);
  const [comunidades, setComunidades] = React.useState([]);
  
  const [followers, setFollowers] = React.useState([]);
  
  
  React.useEffect(function (){
    const followers = fetch(`https://api.github.com/users/${githubUser}/followers`)
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (respostaJson) {
      setFollowers(respostaJson);
    })

    const following = fetch(`https://api.github.com/users/${githubUser}/following`)
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (respostaJson) {
      setFollowing(respostaJson);
    })

    const name = fetch(`https://api.github.com/users/${githubUser}`)
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (respostaJson) {
      setName(respostaJson.name);
    })
  
    //GraphQL -- read-only
    fetch('https://graphql.datocms.com/',{
      method: 'POST',
      headers: {
        'Authorization': '8659ea162afef53c8bbf9c242121c7',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        query: `{
          allCommunities {
            id
            title
            imageUrl
            creatorSlug
            pagelink
          }
        
          _allCommunitiesMeta {
            count
          }
        }`
      })
    })
    .then((response) => response.json())
    .then((respostaJson) => {
      const comunidadesDato = respostaJson.data.allCommunities;
      setComunidades(comunidadesDato);
    })

  }, []);


  return (
  <>
    <AlurakutMenu githubUser={githubUser}/>
    <MainGrid> 
      <div className="profileArea" style={{gridArea: 'profileArea'}}>
        <Box>
          <ProfileSidebar githubUser={githubUser} name={name}/>
        </Box>
      </div>
      <div style={{gridArea: 'welcomeArea'}}>
        <Box>
          <h1 className="title">
            Bem-vindo(a), {name}! 
          </h1>
          <OrkutNostalgicIconSet legal={3} sexy={3} confiavel={3}/>
        </Box>

        <Box>
          <h2 className="subtitle"> O que vc deseja fazer?</h2>
          <form onSubmit={ (e) => {
            e.preventDefault();
            console.log(e);

            const dadosForms = new FormData(e.target);

            const comunidade = {
              title: dadosForms.get('title'),
              imageUrl: dadosForms.get('image'),
              creatorSlug: githubUser
            }

            fetch('/api/comunidades', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body:JSON.stringify(comunidade)
            })
            .then(async (response) => {
              const dados = await response.json();
              setComunidades([...comunidades, dados.record])
            })

            //setComunidades([...comunidades, comunidade])
            }}>
            
            <button disabled={true}>
              Criar Comunidade
            </button>&nbsp;&nbsp;&nbsp;
            <button disabled={true}>
              Escrever Depoimento
            </button >&nbsp;&nbsp;&nbsp;
            <button disabled={true}>
              Escrever um Scrap
            </button>
            <div>
              <input placeholder="Qual será o nome da sua Comunidade?" 
                name="title" 
                aria-label="Qual será o nome da sua Comunidade?"
                type="text"/>
            </div>
            <div>
              <input placeholder="Coloque uma URL para usarmos de capa" 
                name="image" 
                aria-label="Coloque uma URL para usarmos de capa"/>
            </div>
          </form>
          
        </Box>
      </div>
      <div style={{gridArea: 'profileRelationsArea'}}>
      <ProfileRelationsBox title="Seguindo" items={following}/>
        
        <ProfileRelationsBox title="Seguidores" items={followers}/>

        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
          Comunidades ({comunidades.length})
          </h2>
          
          <ul>
            {comunidades.slice(0, 6).map((item) => {
              
              return (
              <li key={item.id}>
                <a href = {`${item.pagelink}`}> 
                  <img src={item.imageUrl}/>
                  <span> {item.title}</span>
                </a>
              </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>
      </div>
    </MainGrid>
  </>
  )
}


export async function getServerSideProps(ctx) {
  const cookies = nookies.get(ctx);
  const token = cookies.USER_TOKEN;
  const decodedToken = jwt.decode(token);
  const githubUser = decodedToken?.githubUser;

  

  const {isAuthenticated} = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {'Authorization': token}
  })
  .then((response) => response.json())

  console.log('isAuthenticated', isAuthenticated)
  if(!isAuthenticated){
    return{
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  if (!githubUser) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  const {message} = await fetch(`https://api.github.com/users/${githubUser}`)
  .then(function (resposta) {
    return resposta.json();
  })
  console.log('exist', message)
  if (message) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  // const followers = await fetch(`https://api.github.com/users/${githubUser}/followers`)
  //   .then((res) => res.json())
  //   .then(followers => followers.map((follower) => ({
  //     id: follower.id,
  //     name: follower.login,
  //     image: follower.avatar_url,
  //   })));

  return {
    props: {
      githubUser,
    }
  }
}