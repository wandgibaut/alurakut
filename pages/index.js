import React from 'react'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import {ProfileRelationsBoxWrapper} from '../src/components/ProfileRelations'
import {AlurakutMenu ,  OrkutNostalgicIconSet, AlurakutProfileSidebarMenuDefault } from '../src/lib/AlurakutCommons'

function ProfileSidebar(props){
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} style={{borderRadius: '8px'}}/>
      <hr/>

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
              <li key={item}>
                <a href = {`https://github.com/${item}.png`}> 
                  <img src={`https://github.com/${item.login}.png`}/>
                  <span> {item.title}</span>
                </a>
              </li>
              )
            })}
          </ul>
    </ProfileRelationsBoxWrapper>
  )
}


export default function Home() {
  
  const githubUser = 'wandgibaut';
  const friends = ['rgudwin', 'andre-paraense', 'estherlc', 'suelenmapa']
  const [comunidades, setComunidades] = React.useState([{
    id: new Date().toISOString(),
    title: 'Eu odeio acordar cedo', 
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  }]);
  
  const [followers, setFollowers] = React.useState([]);
  
  
  React.useEffect(function (){
    const followers = fetch('https://api.github.com/users/wandgibaut/followers')
    .then(function (resposta) {
      return resposta.json();
    })
    .then(function (respostaJson) {
      setFollowers(respostaJson);
    })
  }, []);


  return (
  <>
    <AlurakutMenu githubUser={githubUser}/>
    <MainGrid> 
      <div className="profileArea" style={{gridArea: 'profileArea'}}>
        <Box>
          <ProfileSidebar githubUser={githubUser}/>
        </Box>
      </div>
      <div style={{gridArea: 'welcomeArea'}}>
        <Box>
          <h1 className="title">
            Bem-vindo(a), {githubUser}! 
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
              id: new Date().toISOString(),
              title: dadosForms.get('title'),
              image: dadosForms.get('image')
            }

            setComunidades([...comunidades, comunidade])
            }}>
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
            <button>
              Criar Comunidade
            </button>
          </form>
        </Box>
      </div>
      <div style={{gridArea: 'profileRelationsArea'}}>
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
          Amigos ({friends.length})
          </h2>
          
          <ul>
            {friends.slice(0, 6).map((item) => {
              return (
              <li key={item}>
                <a href = {`/users/${item}`}  key= {item}> 
                  <img src={`https://github.com/${item}.png`}/>
                  <span> {item}</span>
                </a>
              </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>
        
        <ProfileRelationsBox title="Seguidores" items={followers}/>

        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
          Comunidades ({comunidades.length})
          </h2>
          
          <ul>
            {comunidades.slice(0, 6).map((item) => {
              
              return (
              <li key={item.id}>
                <a href = {`/users/${item.title}`}> 
                  <img src={item.image}/>
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
