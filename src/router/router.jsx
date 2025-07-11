import React, {lazy, Suspense} from 'react';
import {BrowserRouter, Route, Routes, Navigate} from "react-router-dom";
import MainLayout from "../layouts/main-layout";
import AuthLayout from "../layouts/auth-layout";
import LoginPage from "../modules/auth/pages/LoginPage";
import IsAuth from "../services/auth/IsAuth";
import IsGuest from "../services/auth/IsGuest";
import NotFoundPage from "../modules/auth/pages/NotFoundPage";
import {OverlayLoader} from "../components/loader";
import LogOutPage from "../modules/auth/pages/LogOutPage";
import UpdatePage from "../modules/claim/pages/UpdatePage";
import NbuListPage from "../modules/claim/pages/NbuListPage";
import NbuViewPage from "../modules/claim/pages/NbuViewPage";


const ListPage = lazy(() => import("../modules/claim/pages/ListPage"));
const ViewPage = lazy(() => import("../modules/claim/pages/ViewPage"));
const CreatePage = lazy(() => import("../modules/claim/pages/CreatePage"));

const Router = ({...rest}) => {
    return (
        <BrowserRouter>
            <Suspense fallback={<OverlayLoader/>}>
                <IsAuth>
                    <Routes>
                        <Route path={"/"} element={<MainLayout/>}>
                            <Route path={"nbu"} element={<NbuListPage/>}/>
                            <Route path={"nbu/view/:claimFormId"} element={<NbuViewPage/>}/>
                            <Route path={"claim"}>
                                <Route index element={<ListPage/>}/>
                                <Route path={"create"} element={<CreatePage/>}/>
                                <Route path={"view/:claimFormId"} element={<ViewPage/>}/>
                                <Route path={"update/:claimFormId"} element={<UpdatePage/>}/>
                            </Route>
                            <Route path="/auth/logout" element={<LogOutPage/>}/>
                            <Route path={"auth/*"} element={<Navigate to={'/claim'} replace/>}/>
                            <Route path={"/"} element={<Navigate to={'/claim'} replace/>}/>
                            <Route path={"*"} element={<NotFoundPage/>}/>
                        </Route>

                    </Routes>
                </IsAuth>

                <IsGuest>
                    <Routes>
                        <Route path={"/auth"} element={<AuthLayout/>}>
                            <Route index element={<LoginPage/>}/>
                        </Route>
                        <Route path={"*"} element={<Navigate to={'/auth'} replace/>}/>
                    </Routes>
                </IsGuest>
            </Suspense>
        </BrowserRouter>
    );
};

export default Router;
