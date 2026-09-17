/* eslint-disable */
// @ts-nocheck
import { Route as rootRouteImport } from './routes/__root'
import { Route as IndexRouteImport } from './routes/index'
import { Route as AuthRouteImport } from './routes/auth'
import { Route as HomeRouteImport } from './routes/home'
import { Route as ExploreRouteImport } from './routes/explore'
import { Route as CreateRouteImport } from './routes/create'
import { Route as ChallengeIdRouteImport } from './routes/challenge.$id'
import { Route as ChallengeIdProveRouteImport } from './routes/challenge.$id.prove'
import { Route as ProfileRouteImport } from './routes/profile'
import { Route as RankingsRouteImport } from './routes/rankings'
import { Route as NotificationsRouteImport } from './routes/notifications'
import { Route as SettingsRouteImport } from './routes/settings'
import { Route as LegalRouteImport } from './routes/legal'
import { Route as FeedbackRouteImport } from './routes/feedback'
import { Route as AdminRouteImport } from './routes/admin'
import { Route as InviteTokenRouteImport } from './routes/invite.$token'
const IndexRoute = IndexRouteImport.update({ id:'/', path:'/', getParentRoute:()=>rootRouteImport } as any)
const AuthRoute = AuthRouteImport.update({ id:'/auth', path:'/auth', getParentRoute:()=>rootRouteImport } as any)
const HomeRoute = HomeRouteImport.update({ id:'/home', path:'/home', getParentRoute:()=>rootRouteImport } as any)
const ExploreRoute = ExploreRouteImport.update({ id:'/explore', path:'/explore', getParentRoute:()=>rootRouteImport } as any)
const CreateRoute = CreateRouteImport.update({ id:'/create', path:'/create', getParentRoute:()=>rootRouteImport } as any)
const ChallengeIdRoute = ChallengeIdRouteImport.update({ id:'/challenge/$id', path:'/challenge/$id', getParentRoute:()=>rootRouteImport } as any)
const ChallengeIdProveRoute = ChallengeIdProveRouteImport.update({ id:'/challenge/$id/prove', path:'/challenge/$id/prove', getParentRoute:()=>rootRouteImport } as any)
const ProfileRoute = ProfileRouteImport.update({ id:'/profile', path:'/profile', getParentRoute:()=>rootRouteImport } as any)
const RankingsRoute = RankingsRouteImport.update({ id:'/rankings', path:'/rankings', getParentRoute:()=>rootRouteImport } as any)
const NotificationsRoute = NotificationsRouteImport.update({ id:'/notifications', path:'/notifications', getParentRoute:()=>rootRouteImport } as any)
const SettingsRoute = SettingsRouteImport.update({ id:'/settings', path:'/settings', getParentRoute:()=>rootRouteImport } as any)
const LegalRoute = LegalRouteImport.update({ id:'/legal', path:'/legal', getParentRoute:()=>rootRouteImport } as any)
const FeedbackRoute = FeedbackRouteImport.update({ id:'/feedback', path:'/feedback', getParentRoute:()=>rootRouteImport } as any)
const AdminRoute = AdminRouteImport.update({ id:'/admin', path:'/admin', getParentRoute:()=>rootRouteImport } as any)
const InviteTokenRoute = InviteTokenRouteImport.update({ id:'/invite/$token', path:'/invite/$token', getParentRoute:()=>rootRouteImport } as any)
export interface FileRoutesByFullPath { '/':typeof IndexRoute; '/auth':typeof AuthRoute; '/home':typeof HomeRoute; '/explore':typeof ExploreRoute; '/create':typeof CreateRoute; '/challenge/$id':typeof ChallengeIdRoute; '/challenge/$id/prove':typeof ChallengeIdProveRoute; '/profile':typeof ProfileRoute; '/rankings':typeof RankingsRoute; '/notifications':typeof NotificationsRoute; '/settings':typeof SettingsRoute; '/legal':typeof LegalRoute; '/feedback':typeof FeedbackRoute; '/admin':typeof AdminRoute; '/invite/$token':typeof InviteTokenRoute }
export interface FileRoutesByTo extends FileRoutesByFullPath {}
export interface FileRoutesById { __root__:typeof rootRouteImport; '/':typeof IndexRoute; '/auth':typeof AuthRoute; '/home':typeof HomeRoute; '/explore':typeof ExploreRoute; '/create':typeof CreateRoute; '/challenge/$id':typeof ChallengeIdRoute; '/challenge/$id/prove':typeof ChallengeIdProveRoute; '/profile':typeof ProfileRoute; '/rankings':typeof RankingsRoute; '/notifications':typeof NotificationsRoute; '/settings':typeof SettingsRoute; '/legal':typeof LegalRoute; '/feedback':typeof FeedbackRoute; '/admin':typeof AdminRoute; '/invite/$token':typeof InviteTokenRoute }
export interface FileRouteTypes { fileRoutesByFullPath:FileRoutesByFullPath; fullPaths:keyof FileRoutesByFullPath; fileRoutesByTo:FileRoutesByTo; to:keyof FileRoutesByTo; id:keyof FileRoutesById; fileRoutesById:FileRoutesById }
declare module '@tanstack/react-router' { interface FileRoutesByPath { '/':{id:'/';path:'/';fullPath:'/';preLoaderRoute:typeof IndexRouteImport;parentRoute:typeof rootRouteImport}; '/auth':{id:'/auth';path:'/auth';fullPath:'/auth';preLoaderRoute:typeof AuthRouteImport;parentRoute:typeof rootRouteImport}; '/home':{id:'/home';path:'/home';fullPath:'/home';preLoaderRoute:typeof HomeRouteImport;parentRoute:typeof rootRouteImport}; '/explore':{id:'/explore';path:'/explore';fullPath:'/explore';preLoaderRoute:typeof ExploreRouteImport;parentRoute:typeof rootRouteImport}; '/create':{id:'/create';path:'/create';fullPath:'/create';preLoaderRoute:typeof CreateRouteImport;parentRoute:typeof rootRouteImport}; '/challenge/$id':{id:'/challenge/$id';path:'/challenge/$id';fullPath:'/challenge/$id';preLoaderRoute:typeof ChallengeIdRouteImport;parentRoute:typeof rootRouteImport}; '/challenge/$id/prove':{id:'/challenge/$id/prove';path:'/challenge/$id/prove';fullPath:'/challenge/$id/prove';preLoaderRoute:typeof ChallengeIdProveRouteImport;parentRoute:typeof rootRouteImport}; '/profile':{id:'/profile';path:'/profile';fullPath:'/profile';preLoaderRoute:typeof ProfileRouteImport;parentRoute:typeof rootRouteImport}; '/rankings':{id:'/rankings';path:'/rankings';fullPath:'/rankings';preLoaderRoute:typeof RankingsRouteImport;parentRoute:typeof rootRouteImport}; '/notifications':{id:'/notifications';path:'/notifications';fullPath:'/notifications';preLoaderRoute:typeof NotificationsRouteImport;parentRoute:typeof rootRouteImport}; '/settings':{id:'/settings';path:'/settings';fullPath:'/settings';preLoaderRoute:typeof SettingsRouteImport;parentRoute:typeof rootRouteImport}; '/legal':{id:'/legal';path:'/legal';fullPath:'/legal';preLoaderRoute:typeof LegalRouteImport;parentRoute:typeof rootRouteImport}; '/feedback':{id:'/feedback';path:'/feedback';fullPath:'/feedback';preLoaderRoute:typeof FeedbackRouteImport;parentRoute:typeof rootRouteImport}; '/admin':{id:'/admin';path:'/admin';fullPath:'/admin';preLoaderRoute:typeof AdminRouteImport;parentRoute:typeof rootRouteImport}; '/invite/$token':{id:'/invite/$token';path:'/invite/$token';fullPath:'/invite/$token';preLoaderRoute:typeof InviteTokenRouteImport;parentRoute:typeof rootRouteImport} } }
const rootRouteChildren = { IndexRoute, AuthRoute, HomeRoute, ExploreRoute, CreateRoute, ChallengeIdRoute, ChallengeIdProveRoute, ProfileRoute, RankingsRoute, NotificationsRoute, SettingsRoute, LegalRoute, FeedbackRoute, AdminRoute, InviteTokenRoute }
export const routeTree = rootRouteImport._addFileChildren(rootRouteChildren)._addFileTypes<FileRouteTypes>()
import type { getRouter } from './router.tsx'
import type { startInstance } from './start.ts'
declare module '@tanstack/react-start' { interface Register { ssr:true; router:Awaited<ReturnType<typeof getRouter>>; config:Awaited<ReturnType<typeof startInstance.getOptions>> } }
