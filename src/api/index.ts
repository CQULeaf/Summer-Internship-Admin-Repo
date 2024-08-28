import request from '../utils/request';

export const fetchData = () => {
    return request({
        url: './mock/table.json',
        method: 'get'
    });
};

export const fetchUserData = () => {
    return request({
        url: 'http://localhost:1234/user/all',
        method: 'get'
    });
};

export const fetchPostData = () => {
    return request({
        url: 'http://localhost:1234/ccPost/getAllPosts',
        method: 'get'
    });
};

export const fetchTopicData = () => {
    return request({
        url: 'http://localhost:1234/corner/topics',
        method: 'get'
    });
};

export const fetchRoleData = () => {
    return request({
        url: './mock/role.json',
        method: 'get'
    });
};
