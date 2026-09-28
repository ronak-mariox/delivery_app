import {createNavigationContainerRef, StackActions} from '@react-navigation/native';
import {RootStackParamList} from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function resetToRoute<RouteName extends keyof RootStackParamList>(
  name: RouteName,
  params?: RootStackParamList[RouteName],
) {
  if (!navigationRef.isReady()) {
    return;
  }
  navigationRef.dispatch(StackActions.popToTop());
  navigationRef.reset({index: 0, routes: [{name, params} as never]});
}
