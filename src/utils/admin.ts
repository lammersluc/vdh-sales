const admin = () => typeof localStorage !== 'undefined' && localStorage.getItem('admin') === 'true';

export { admin };