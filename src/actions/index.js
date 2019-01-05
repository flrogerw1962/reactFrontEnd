import request from 'superagent';
// import { browserHistory } from 'react-router';
import jwtDecode from 'jwt-decode';
import * as types from './actionTypes';
import jsonp from 'superagent-jsonp';
import { assign } from 'lodash';

const ROOT_URL = process.env.API_URL;


// NOTE App config load
export function appConfig(salesChannel) {
  return (dispatch) => {
    return request.get(`${ROOT_URL}/appdata/${salesChannel}`)
    .then(res => {
      const { products, items, taxRates, config } = res.body;
      dispatch(fetchProductsSuccess(products, items));
      dispatch(fetchTaxRates(taxRates));
      dispatch(setAppConfig(config));
    });
  };
}

export function setAppConfig(config) {
  return {
    type: types.SET_CONFIG,
    config,
  };
}
export function setMultiPhoto(multiPhoto) {
  return {
    type: types.SET_MULTI_PHOTO,
    multiPhoto,
  };
}
export function setExpressMode(express) {
  return {
    type: types.SET_EXPRESS_MODE,
    express,
  };
}
export function fetchTaxRates(taxList) {
  return {
    type: types.TAXES_FETCH_SUCCESS,
    taxList,
  };
}
// export function cleanEnv() {
//   return dispatch => {
//     return request.get(`${ROOT_URL}/appdata/1`)
//     .then(res => {
//       debugger; // eslint-disable-line
//       const body = res;
//       console.log(body);
      // dispatch(clearProjectList);
      // dispatch(clearCurrentProject);
      // dispatch(() => { return { type: types.CLEAR_CART }; });
//     });
//   };
// }
// NOTE User account
export function fetchUser() {
  const { token } = authInfo();
  return (dispatch) => {
    if (token) {
      return request.get(`${ROOT_URL}/users`)
        .set({ Authorization: token })
        .then(res => {
          const user = res.body.user;
          dispatch({
            type: types.FETCH_USER_SUCCESS,
            user,
          });
        })
        .catch(error => {
          dispatch({
            type: types.FETCH_USER_ERROR,
            error: error.body,
          });
        });
    }
    return null;
  };
}

export function fetchAddresses() {
  const { token } = authInfo();
  return (dispatch) => {
    if (token) {
      request.get(`${ROOT_URL}/users/addresses`)
        .set({ Authorization: token })
        .then(res => {
          dispatch({
            type: types.FETCH_ADDRESSES_SUCCESS,
            addresses: res.body.address,
          });
        })
        .catch(error => {
          dispatch({
            type: types.FETCH_ADDRESSES_ERROR,
            error: error.body,
          });
        });
    }
    return null;
  };
}

export function saveAddress(project) {
  return (dispatch) => {
    if (project) {
      request.post(`${ROOT_URL}/cart/add_item`)
        .send(assign(project, { cartId: authInfo().cartId }))
        .then(res => {
          localStorage.setItem('cartId', res.body.cart.cartId);
          // dispatch({
          //   type: types.CLEAR_CURRENT_PROJECT,
          // });
          // dispatch(fetchCartSuccess(res.body.cart));
        })
        .catch(error => {
          dispatch({
            type: types.CART_FETCH_ERROR,
            error: error.body,
          });
        });
    }
    return null; // error no project
  };
}

export function createAccount(data) {
  return (dispatch) => {
    const authData = {
      email: data.email,
      password: data.password,
    };
    const { cartId } = authInfo();
    if (cartId) {
      authData.cartId = cartId;
    }
    request.post(`${ROOT_URL}/sign_up`)
      .send(authData)
      .then(res => {
        setAuth(res.body.token);
        dispatch(authSuccess());
      })
      .catch(error => {
        dispatch(authFailure(error.body));
      });
  };
}

/**
 * Logging in or creating an account will return
 * a token that contains a new cartId for the user.
 * If the user already has a cart with cartId, then
 * use that cart in the sign_in
 */
export function login(data) {
  return (dispatch) => {
    const { cartId } = authInfo();
    const authData = {
      email: data.email,
      password: data.password,
    };
    if (cartId) {
      authData.cartId = cartId;
    }
    request.post(`${ROOT_URL}/sign_in`)
      .send(authData)
      .then(res => {
        setAuth(res.body.token);
        dispatch(authSuccess());
      })
      .catch(error => {
        dispatch(authFailure(error.body));
      });
  };
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('cartId');
  return {
    type: types.LOGOUT,
  };
}

export function clearAuthErrors() {
  return {
    type: types.AUTH_CLEAR_ERRORS,
  };
}

export function authSuccess() {
  return {
    type: types.AUTH_SUCCESS,
  };
}

export function authFailure(error) {
  return {
    type: types.AUTH_FAILURE,
    error,
  };
}

function setAuth(token) {
  localStorage.setItem('token', token);
  // Only save the cartId if it's something
  const decodedToken = jwtDecode(token);
  if (decodedToken.cartId) {
    localStorage.setItem('cartId', decodedToken.cartId);
  }
  return {};
}

export function authInfo(dispatch = null) {
  if (typeof localStorage === 'undefined') {
    return {};
  }

  const token = localStorage.getItem('token');
  if (token) {
    const decodedToken = jwtDecode(token);

    if (new Date(decodedToken.exp * 1000) > new Date()) {
      decodedToken.token = token;
      if (dispatch) {
        dispatch(authSuccess());
      }
      return decodedToken;
    }

    // if timeout, get rid of the token, but leave the cart (is leaving the cart the right thing to do?)
    localStorage.removeItem('token');
    if (dispatch) {
      dispatch(authFailure('session timed out'));
    }
    return {
      token: null,
      userId: 0,
      cartId: localStorage.getItem('cartId'),
      expired: true,
    };
  }
  if (dispatch) {
    dispatch(authFailure('no auth token'));
  }
  return {
    token: null,
    userId: 0,
    cartId: localStorage.getItem('cartId'),
  };
}

// NOTE Photos
let gettingUserAccountPhotos = false;
// I realize in react I should be dispatching all over the
// place to reset this flag.  But a simple boolean private to this module is so much simpler,
// transparent, cohesive and a lot more efficient.

export function fetchUserAccountPhotos() {
  return (dispatch) => {
    const { token } = authInfo(dispatch);
    if (!gettingUserAccountPhotos && token) {
      gettingUserAccountPhotos = true;
      request.get(`${ROOT_URL}/users/photos`)
        .set({ Authorization: token })
        .then(res => {
          gettingUserAccountPhotos = false;
          dispatch(fetchUserAccountPhotosSuccess(res.body.photos));
        })
        .catch(error => {
          dispatch({
            type: types.USERACCOUNT_PHOTOS_FETCH_ERROR,
            error: error.body,
          });
        });
    }
    return null;
  };
}

export function fetchUserAccountPhotosSuccess(photos) {
  return {
    type: types.USERACCOUNT_PHOTOS_FETCH_SUCCESS,
    photos,
  };
}

export function fetchFacebookImages(photosFacebook) {
  return {
    type: types.FACEBOOK_FETCH_IMAGES,
    photosFacebook,
  };
}

export function fetchMoreFacebookImages(nextUrl, folderID) {
  if (nextUrl) {
    return (dispatch, getState) => {
      const current = getState().photos;
      const url = `${nextUrl}`;
      request.get(url)
        .then(res => {
          const result = Array.filter(current.facebook, (album) => {
            if (album.id === folderID) {
              const photos = album.photos.data.concat(res.body.data);
              assign(album.photos.data, photos);
              assign(album.photos.paging, { next: res.body.paging.next });
            }
            return album;
          });
          dispatch(fetchFacebookImages(result));
        })
        .catch(error => {
          const myError = error.body.errorMessage || 'Sorry! Something went wrong.';
          alert(myError);
        });
    };
  }
  return null;
}

export function getInstagramPhotos(authToken, nextUrl) {
  if (nextUrl) {
    return (dispatch, getState) => {
      const current = getState().photos;
      const url = `${nextUrl}`;
      request.get(url)
        .use(jsonp({ timeout: 3000 })) // added 3s before say that's unsuccessful
        .then(res => {
          const result = {
            data: current.instagram.data.concat(res.body.data),
            pagination: res.body.pagination,
          };
          dispatch(fetchInstagramImages(result));
        })
        .catch(error => {
          const myError = error.body.errorMessage || 'Sorry! Something went wrong.';
          alert(myError);
        });
    };
  }
  return (dispatch) => {
    const url = `https://api.instagram.com/v1/users/self/media/recent/?access_token=${authToken}&count=25`;
    request.get(url)
      .use(jsonp({ timeout: 3000 })) // added 3s before say that's unsuccessful
      .then(res => {
        dispatch(fetchInstagramImages(res.body));
      })
      .catch(error => {
        const myError = error.body.errorMessage || 'Sorry! Something went wrong.';
        alert(myError);
      });
  };
}

export function fetchInstagramImages(photosInstagram) {
  return {
    type: types.INSTAGRAM_FETCH_IMAGES,
    photosInstagram,
  };
}
/**
 * This begins the process of defining a project.  A photo + product (option).
 * If user's not logged in it's never saved and only serves to connect the 2
 * key things.
 */
export function uploadPhoto(file) {
  let key = '';
  key = `anonymous/${Date.now()}-${file.name}`;
  key = key.replace(/\s+/g, '');
  key = encodeURI(key);

  return dispatch => {
    return request.post('http://52.39.54.120:3001/anonymous/policy')
      .send({ fileName: key })
      .then(res => {
        const response = res.body;
        return dispatch(uploadPhotoToS3(file, key, response.message.awsKey, response.message.policy,
            response.message.signature, response.message.bucket));
      }, error => {
        return dispatch(uploadPhotoFailure(file.name, error.body));
      });
  };
}

export function uploadPhotoToS3(file, key, awsAccessKeyId, policy, signature, bucket) {
  return (dispatch, getState) => {
    const baseUrl = `http://${bucket}.s3.amazonaws.com/`;
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    const { multiPhoto } = getState().config;
    formData.append('key', key);
    formData.append('AWSAccessKeyId', awsAccessKeyId);
    formData.append('policy', policy);
    formData.append('signature', signature);
    formData.append('acl', 'public-read');
    formData.append('Content-Type', file.type);
    formData.append('file', file);

    xhr.addEventListener('load', () => {
      const photoUrl = baseUrl + key;
      dispatch(setSelectedPhoto({ photoUrl: baseUrl + key }));
      if (multiPhoto === true) {
        dispatch(addPhotoToList(photoUrl));
      } else {
        dispatch(addPhotoToProject(photoUrl, {}));
      }
      dispatch(uploadPhotoSuccess(true));
    }, false);
    xhr.addEventListener('error', () => {
      dispatch(uploadPhotoFailure(false, file.name));
    }, false);
    xhr.addEventListener('abort', () => {
      dispatch(uploadPhotoFailure(false, file.name));
    }, false);
    xhr.open('POST', baseUrl, true);
    return xhr.send(formData);
  };
}

function uploadPhotoFailure(uploaded, fileName) {
  return {
    type: types.USERPHOTO_UPLOAD_ERROR,
    uploaded,
    fileName,
  };
}

export function uploadPhotoSuccess(uploaded) {
  return {
    type: types.USERPHOTO_UPLOAD_SUCCESS,
    uploaded,
  };
}

// NOTE Projects
export function setSelectedPhoto(photo) {
  return {
    type: types.SELECTED_PHOTO,
    photo,
  };
}

export function addPhotoToProject(photo, edits) {
  return {
    type: types.ADD_PHOTO_TO_PROJECT,
    photo,
    edits,
  };
}

export function addEditToProject(canvasData, jsonResult) {
  return {
    type: types.ADD_EDIT_PHOTO_TO_PROJECT,
    canvasData,
    jsonResult,
  };
}

export function clearEditToProject(canvasData) {
  return {
    type: types.CLEAR_EDIT_PHOTO_TO_PROJECT,
    canvasData,
  };
}

export function cancelEditProject(current) {
  return {
    type: types.PROJECT_CANCEL_EDITS,
    current,
  };
}

export function addPhotoItemsOptions(item) {
  return {
    type: types.ADD_PHOTO_ITEMS_OPTIONS,
    item,
  };
}

export function editPhotoItemsOptions(id, nameOption, productId) {
  return {
    type: types.EDIT_PHOTO_ITEMS_OPTIONS,
    id,
    nameOption,
    productId,
  };
}

export function addItemsQuantity(qty) {
  return {
    type: types.ADD_ITEMS_QUANTITY,
    qty,
  };
}
export function addPhotoToList(item) {
  return {
    type: types.ADD_PHOTOS_TO_LIST,
    item,
  };
}
export function removePhotoFromList(itemId) {
  return {
    type: types.REMOVE_PHOTO_FROM_LIST,
    itemId,
  };
}
export function setSelectedPhotoId(id) {
  return {
    type: types.SET_SELECTED_PHOTO_ID,
    id,
  };
}
export function clearCurrentProject() {
  return {
    type: types.PROJECTS_CLEAR_CURRENT,
  };
}
export function clearProjectList() {
  return {
    type: types.CLEAR_PROJECT_LIST,
  };
}

// NOTE Cart
/**
 * Adds the current project to cart.
 * If I don't have a cartId in my request, server
 * will create a new cart, add the item to it and return
 * the new cart.
 */
export function saveCartItem(item, productId, photoCustomization, qty, price) {
  return {
    type: types.ADD_CART_ITEM,
    item,
    productId,
    photoCustomization,
    qty,
    price,
  };
}

export function updateCartItem(cartItemId, item, qty) {
  return {
    type: types.EDIT_CART_ITEM,
    cartItemId,
    item,
    qty,
  };
}

export function deleteCartItem(itemId) {
  return {
    type: types.REMOVE_CART_ITEM,
    itemId,
  };
}


// NOTE Orders
export function placeOrder(stripeToken) {
  // const { cartId, token } = authInfo();
  return (dispatch) => {
    if (stripeToken) {
      // dispatch(clearCurrentProject);
      request.get(`${ROOT_URL}/appdata/1`)
        .then(res => {
          dispatch(clearProjectList());
          dispatch(clearCurrentProject());
          dispatch({ type: types.CLEAR_CART });
          console.log(res);
          // dispatch(placeOrderSuccess(res.body));
          // browserHistory.push('/order-success');
        })
        .catch(error => {
          dispatch({
            type: types.CART_DELETE_ERROR,
            error: error.body,
          });
        });
    }
    return null;
  };
}

export function placeOrderSuccess(data) {
  // currently, no reducer is listening for this action.
  // should it reset the cart? is that the responsibility of the api?
  return {
    type: types.ORDER_PLACE_SUCCESS,
    res: data,
  };
}

// NOTE Products
export function fetchProductsAndCategories() {
  return dispatch => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  };
}

export function fetchProducts() {
  return (dispatch) => {
    request.get(`${ROOT_URL}/1/products`)
      .then(res => {
        dispatch(fetchProductsSuccess(res.body.products));
      })
      .catch(error => {
        dispatch({
          type: types.PRODUCTS_FETCH_ERROR,
          error: error.body,
        });
      });
  };
}

export function fetchProductsSuccess(products, items) {
  return {
    type: types.PRODUCTS_FETCH_SUCCESS,
    products,
    items,
  };
}

export function fetchCategories() {
  return (dispatch) => {
    request.get(`${ROOT_URL}/1/categories`)
      .then(res => {
        dispatch(fetchCategoriesSuccess(res.body));
      })
      .catch(error => {
        dispatch({
          type: types.CATEGORIES_FETCH_ERROR,
          error: error.body,
        });
      });
  };
}

export function fetchCategoriesSuccess(categories) {
  return {
    type: types.CATEGORIES_FETCH_SUCCESS,
    categories,
  };
}

// NOTE Individual product
export function fetchProduct(id) {
  return (dispatch) => {
    request.get(`${ROOT_URL}/products/${id}`)
      .then(res => {
        dispatch(fetchProductSuccess(res.body.products));
      })
      .catch(error => {
        dispatch({
          type: types.PRODUCT_FETCH_ERROR,
          error: error.body,
        });
      });
  };
}

export function fetchProductSuccess(product) {
  return {
    type: types.PRODUCT_FETCH_SUCCESS,
    product,
  };
}
