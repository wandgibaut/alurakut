import styled from 'styled-components'
import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import {ProfileRelationsBoxWrapper} from '../src/components/ProfileRelations'
import {AlurakutMenu ,  OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons'

function ProfileSidebar(props){
  return (
    <Box>
      <img src={`https://github.com/${props.githubUser}.png`} style={{borderRadius: '8px'}}/>
    </Box>
  )

}



export default function Home() {
  const githubUser = 'wandgibaut';
  const friends = ['rgudwin', 'andre-paraense', 'estherlc', 'suelenmapa']
  return (
  <>
    <AlurakutMenu/>
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
          <OrkutNostalgicIconSet/>
        </Box>
      </div>
      <div style={{gridArea: 'profileRelationsArea'}}>
        <ProfileRelationsBoxWrapper>
          <h2 className="smallTitle">
          Amigos ({friends.length})
          </h2>
          
          <ul>
            {friends.map((item) => {
              return (
              <li>
                <a href = {`/users/${item}`}  key= {item}> 
                  <img src={`https://github.com/${item}.png`}/>
                  <span> {item}</span>
                </a>
              </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>
        <Box>
          Comunidades
        </Box>
      </div>
    </MainGrid>
  </>
  )
}
