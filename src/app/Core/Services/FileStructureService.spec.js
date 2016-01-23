/* global beforeEach:true, describe:true, it:true */
'use strict';

// Angular:
import angular from 'angular';
import 'angular-mocks';

// Utilities:
import chai from 'chai';
import dirtyChai from 'dirty-chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

// Test setup:
const expect = chai.expect;
chai.use(dirtyChai);
chai.use(sinonChai);

// Testing:
import './FileStructureService';
let fileStructureService;

describe('FileStructureService.js:', () => {

    let $httpBackend;
    let httpResponseInterceptor;
    let persistentStateService;

    beforeEach(() => {
        angular.mock.module('tractor.fileStructureService');

        angular.mock.module(($provide, $httpProvider) => {
            $provide.factory('httpResponseInterceptor', () => {
                httpResponseInterceptor = {};
                return httpResponseInterceptor;
            });
            $provide.factory('persistentStateService', () => {
                persistentStateService = {};
                return persistentStateService;
            });

            $httpProvider.interceptors.push('httpResponseInterceptor');
        });

        angular.mock.inject((_$httpBackend_, _fileStructureService_) => {
            $httpBackend = _$httpBackend_;
            fileStructureService = _fileStructureService_;
        });
    });

    describe('FileStructureService.getFileStructure:', () => {
        it('should get the current file structure from the server:', done => {
            let fileStructure = {
                directory: {
                    directories: []
                }
            };

            httpResponseInterceptor.response = angular.noop;
            persistentStateService.get = angular.noop;
            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructure);
            sinon.stub(persistentStateService, 'get').returns({});
            $httpBackend.whenGET('/components/file-structure').respond({});

            fileStructureService.getFileStructure('components')
            .then(fileStructure => {
                expect(fileStructure).to.equal(fileStructure);
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });

        it('should update the `open` state of the directories:', done => {
            let directory = {
                path: '/path/to/open/directory',
                directories: []
            };
            let fileStructure = {
                directory: {
                    directories: [directory]
                }
            };
            let openDirectories = {
                '/path/to/open/directory': true
            };

            httpResponseInterceptor.response = angular.noop;
            persistentStateService.get = angular.noop;
            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructure);
            sinon.stub(persistentStateService, 'get').returns(openDirectories);
            $httpBackend.whenGET('/components/file-structure').respond({});

            fileStructureService.getFileStructure('components')
            .then(() => {
                expect(directory.open).to.be.true();
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });
    });

    describe('FileStructureService.addDirectory:', () => {
        it('should make a request to add a new directory:', done => {
            let fileStructure = {
                directory: {
                    directories: []
                }
            };

            httpResponseInterceptor.response = angular.noop;
            persistentStateService.get = angular.noop;
            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructure);
            sinon.stub(persistentStateService, 'get').returns({});
            $httpBackend.whenPOST('/component/directory').respond({});

            fileStructureService.addDirectory('component')
            .then(fileStructure => {
                expect(fileStructure).to.equal(fileStructure);
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });

        it('should update the `open` state of the directories:', done => {
            let directory = {
                path: '/path/to/open/directory',
                directories: []
            };
            let fileStructure = {
                directory: {
                    directories: [directory]
                }
            };
            let openDirectories = {
                '/path/to/open/directory': true
            };

            httpResponseInterceptor.response = angular.noop;
            persistentStateService.get = angular.noop;
            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructure);
            sinon.stub(persistentStateService, 'get').returns(openDirectories);
            $httpBackend.whenPOST('/component/directory').respond({});

            fileStructureService.addDirectory('component')
            .then(() => {
                expect(directory.open).to.be.true();
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });
    });

    describe('FileStructureService.copyFile:', () => {
        it('should make a request to copy a file:', done => {
            let fileStructure = {
                directory: {
                    directories: []
                }
            };

            httpResponseInterceptor.response = angular.noop;
            persistentStateService.get = angular.noop;
            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructure);
            sinon.stub(persistentStateService, 'get').returns({});
            $httpBackend.whenPOST('/component/file/copy').respond({});

            fileStructureService.copyFile('component')
            .then(fileStructure => {
                expect(fileStructure).to.equal(fileStructure);
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });

        it('should update the `open` state of the directories:', done => {
            let directory = {
                path: '/path/to/open/directory',
                directories: []
            };
            let fileStructure = {
                directory: {
                    directories: [directory]
                }
            };
            let openDirectories = {
                '/path/to/open/directory': true
            };

            httpResponseInterceptor.response = angular.noop;
            persistentStateService.get = angular.noop;
            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructure);
            sinon.stub(persistentStateService, 'get').returns(openDirectories);
            $httpBackend.whenPOST('/component/file/copy').respond({});

            fileStructureService.copyFile('component')
            .then(() => {
                expect(directory.open).to.be.true();
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });
    });

    describe('FileStructureService.deleteDirectory:', () => {
        it('should make a request to delete a directory:', done => {
            let fileStructure = {
                directory: {
                    directories: []
                }
            };
            let options = {};

            httpResponseInterceptor.response = angular.noop;
            persistentStateService.get = angular.noop;
            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructure);
            sinon.stub(persistentStateService, 'get').returns({});
            $httpBackend.whenDELETE('/component/directory').respond({});

            fileStructureService.deleteDirectory('component', options)
            .then(fileStructure => {
                expect(fileStructure).to.equal(fileStructure);
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });

        it('should update the `open` state of the directories:', done => {
            let directory = {
                path: '/path/to/open/directory',
                directories: []
            };
            let fileStructure = {
                directory: {
                    directories: [directory]
                }
            };
            let openDirectories = {
                '/path/to/open/directory': true
            };
            let options = {};

            httpResponseInterceptor.response = angular.noop;
            persistentStateService.get = angular.noop;
            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructure);
            sinon.stub(persistentStateService, 'get').returns(openDirectories);
            $httpBackend.whenDELETE('/component/directory').respond({});

            fileStructureService.deleteDirectory('component', options)
            .then(() => {
                expect(directory.open).to.be.true();
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });
    });

    describe('FileStructureService.deleteFile:', () => {
        it('should make a request to delete a file:', done => {
            let fileStructure = {
                directory: {
                    directories: []
                }
            };

            httpResponseInterceptor.response = angular.noop;
            persistentStateService.get = angular.noop;
            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructure);
            sinon.stub(persistentStateService, 'get').returns({});
            $httpBackend.whenDELETE('/component/file').respond({});

            fileStructureService.deleteFile('component')
            .then(fileStructure => {
                expect(fileStructure).to.equal(fileStructure);
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });

        it('should update the `open` state of the directories:', done => {
            let directory = {
                path: '/path/to/open/directory',
                directories: []
            };
            let fileStructure = {
                directory: {
                    directories: [directory]
                }
            };
            let openDirectories = {
                '/path/to/open/directory': true
            };

            httpResponseInterceptor.response = angular.noop;
            persistentStateService.get = angular.noop;
            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructure);
            sinon.stub(persistentStateService, 'get').returns(openDirectories);
            $httpBackend.whenDELETE('/component/file').respond({});

            fileStructureService.deleteFile('component')
            .then(() => {
                expect(directory.open).to.be.true();
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });
    });

    describe('FileStructureService.editDirectoryPath:', () => {
        it('should make a request to edit the path of a directory:', done => {
            let fileStructure = {
                directory: {
                    directories: []
                }
            };
            let options = {};

            httpResponseInterceptor.response = angular.noop;
            persistentStateService.get = angular.noop;
            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructure);
            sinon.stub(persistentStateService, 'get').returns({});
            $httpBackend.whenPATCH('/component/directory/path').respond({});

            fileStructureService.editDirectoryPath('component', options)
            .then(fileStructure => {
                expect(options.isDirectory).to.be.true();
                expect(fileStructure).to.equal(fileStructure);
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });

        it('should update the `open` state of the directories:', done => {
            let directory = {
                path: '/path/to/open/directory',
                directories: []
            };
            let fileStructure = {
                directory: {
                    directories: [directory]
                }
            };
            let openDirectories = {
                '/path/to/open/directory': true
            };
            let options = {};

            httpResponseInterceptor.response = angular.noop;
            persistentStateService.get = angular.noop;
            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructure);
            sinon.stub(persistentStateService, 'get').returns(openDirectories);
            $httpBackend.whenPATCH('/component/directory/path').respond({});

            fileStructureService.editDirectoryPath('component', options)
            .then(() => {
                expect(directory.open).to.be.true();
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });
    });

    describe('FileStructureService.editFilePath:', () => {
        it('should make a request to edit the path of a file:', done => {
            let fileStructure = {
                directory: {
                    directories: []
                }
            };

            httpResponseInterceptor.response = angular.noop;
            persistentStateService.get = angular.noop;
            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructure);
            sinon.stub(persistentStateService, 'get').returns({});
            $httpBackend.whenPATCH('/component/file/path').respond({});

            fileStructureService.editFilePath('component')
            .then(fileStructure => {
                expect(fileStructure).to.equal(fileStructure);
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });

        it('should update the `open` state of the directories:', done => {
            let directory = {
                path: '/path/to/open/directory',
                directories: []
            };
            let fileStructure = {
                directory: {
                    directories: [directory]
                }
            };
            let openDirectories = {
                '/path/to/open/directory': true
            };

            httpResponseInterceptor.response = angular.noop;
            persistentStateService.get = angular.noop;
            sinon.stub(httpResponseInterceptor, 'response').returns(fileStructure);
            sinon.stub(persistentStateService, 'get').returns(openDirectories);
            $httpBackend.whenPATCH('/component/file/path').respond({});

            fileStructureService.editFilePath('component')
            .then(() => {
                expect(directory.open).to.be.true();
                done();
            })
            .catch(done.fail);

            $httpBackend.flush();
        });
    });

    describe('FileStructureService.toggleOpenDirectory:', () => {
        it('should toggle the `open` state of a given directory path:', () => {
            let openDirectories = {
                'toggle/open/to/closed': true
            };

            persistentStateService.get = angular.noop;
            persistentStateService.set = angular.noop;
            sinon.stub(persistentStateService, 'get').returns(openDirectories);
            sinon.stub(persistentStateService, 'set');

            fileStructureService.toggleOpenDirectory('toggle/open/to/closed');
            fileStructureService.toggleOpenDirectory('toggle/closed/to/open');

            expect(openDirectories['toggle/closed/to/open']).to.be.true();
            expect(openDirectories['toggle/open/to/closed']).to.be.undefined();
        });
    });
});
