import { avatarsArr } from "./assets/avatars";
import RegistrationPage from "./components/RegistrationPage";
import SignInPage from "./components/SignInPage";
import TypingApp from "./components/Typing_App";
import { useGame, PagesRoutes } from "./reducers/gameReducer";
import GraphPage from "./components/GraphPage";
import { useIndexDB } from "./components/hooks/indexdbHook";
import { useTheme } from "@mui/material";

export default function App() {
  const theme = useTheme();
  const [stateGame, dispatchGame] = useGame();
  const { dbReady, saveData, saveStatistics, getUsers } = useIndexDB();

  return <>
    {
      stateGame!.page === PagesRoutes.TYPING_APP && dbReady &&
      <TypingApp stateGame={stateGame} dispatchGame={dispatchGame} saveStatistics={saveStatistics} theme={theme}/>
    }
    {
      stateGame!.page === PagesRoutes.SIGNUP && dbReady &&
      <RegistrationPage avatars={avatarsArr} dispatchGame={dispatchGame} saveData={saveData} getUsers={getUsers}/>
    }
    {
      stateGame!.page === PagesRoutes.SIGNIN && dbReady &&
      <SignInPage dispatchGame={dispatchGame} getUsers={getUsers}/>
    }

    {
      stateGame!.page === PagesRoutes.STATISTICS && 
      <GraphPage name={stateGame.name} avatar={stateGame.avatar} statistics={stateGame.statistics} dispatchGame={dispatchGame}/>
    }
  </>
}
