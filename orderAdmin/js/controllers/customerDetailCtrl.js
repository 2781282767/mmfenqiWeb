/**
 * Created by sheldon on 2016/5/5.
 */
app.controller('CustomerDetailCtrl', ['$scope', '$stateParams', '$state', '$modal', 'toaster', function ($scope, $stateParams, $state, $modal, toaster) {
    $scope.customerId = $stateParams.id;
    $scope.$parent.isCreate = true;

    //第一板块
    $.get('/html/mmfq/api/schools/get_schools').then(function (res) {
        if (res.code == 0) {
            console.log(res);
            $scope.$apply(function () {
                $scope.$parent.schoolKinds = res.data;
            });
        } else {
            console.log(res.message)
        }
    }, function (error) {
        console.log(error)
    });

    $.get('/html/mmfq/api/customers/get_customer', {
        customer_id: $scope.customerId
    }).then(function (res) {
        if (res.code == 0) {
            $scope.$apply(function () {
                console.log(res.data);
                $scope.$parent.customer = {
                    name: res.data.name,
                    age: Number(res.data.age),
                    telephone: Number(res.data.telephone),
                    school: res.data.school,
                    push: res.data.push,
                    sign_date: res.data.sign_date
                };
            })
        } else {
            toaster.pop('error', '获取用户信息', res.message);
        }
    }, function (error) {
        toaster.pop('error', '获取用户信息', error);
    });

    $scope.$parent.updateCustomer = function () {
        $.post('/html/mmfq/api/customers/update_customer_info', {
            customer_id: $scope.customerId,
            name: $scope.$parent.customer.name,
            telephone: $scope.$parent.customer.telephone,
            school: $scope.$parent.customer.school,
            age: $scope.$parent.customer.age,
            push: $scope.$parent.customer.push,
            sign_date: (Date.parse($scope.$parent.customer.sign_date) / 1000)
        }).then(function (res) {
            if (res.code == 0) {
                $scope.$apply(function () {
                    toaster.pop('success', '修改成功', '');
                });
                console.log(res);
            } else {
                $scope.$apply(function () {
                    toaster.pop('error', '操作失败', res.message);
                });
            }
        }, function (error) {
            toaster.pop('error', '操作失败', error);
        })
    };

    $scope.$parent.openDelete = function () {

        $scope.$root.okDelete = function () {
            $scope.modalInstance.close();
            $.post('/html/mmfq/api/customers/delete_customer', {
                customer_id: $scope.customerId
            }).then(function (res) {
                if (res.code == 0) {
                    console.log(res.data);
                    $state.go('app.customer.list');
                } else {
                    $scope.$apply(function () {
                        toaster.pop('error', '操作失败', res.message);
                    });
                }
            }, function (error) {
                $scope.$apply(function () {
                    toaster.pop('error', '操作失败', error);
                });
            })
        };

        $scope.$root.cancelDelete = function () {
            $scope.modalInstance.dismiss('cancel');

        };

        $scope.modalInstance = $modal.open({
            templateUrl: 'myModalContent.html'
        });

        $scope.modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            console.log('Modal dismissed at: ' + new Date());
        });
    };


    //第二板块
    $scope.$parent.project = {};
    $scope.$parent.isCreateProject = true;

    $.get('/html/mmfq/api/hospitals/get_hospitals').then(function (res) {
        if (res.code == 0) {
            $scope.$apply(function () {
                $scope.$parent.hospitalKinds = res.data;
            })
        } else {
            $scope.$apply(function () {
                toaster.pop('error', '获取医院分类失败', res.message);
            })
        }
    }, function (error) {
        $scope.$apply(function () {
            toaster.pop('error', '获取医院分类失败', error);
        })
    });


    $scope.initProjectData = function () {
        $.get('/html/mmfq/api/projects/get_projects', {
            customer_id: $scope.customerId
        }).then(function (res) {
            if (res.code == 0) {
                $scope.$apply(function () {
                    $scope.$parent.projects = res.data;
                    console.log($scope.$parent.projects);
                })
            } else {
                $scope.$apply(function () {
                    toaster.pop('error', '获取项目分类失败', res.message);
                })
            }
        }, function (error) {
            $scope.$apply(function () {
                toaster.pop('error', '获取项目分类失败', error);
            })
        });

    };

    $scope.initProjectData();

    $.get('/html/mmfq/api/project_kinds/get_project_kinds').then(function (res) {
        if (res.code == 0) {
            $scope.$apply(function () {
                console.log(res);
                $scope.$parent.projectKinds = res.data;
            })
        } else {
            $scope.$apply(function () {
                toaster.pop('error', '获取项目分类失败', res.message);
            })
        }
    }, function (error) {
        toaster.pop('error', '获取项目分类失败', error);
    });


    $scope.$parent.changeProject = function () {
        if ($scope.$parent.isCreateProject == true) {
            $.post('/html/mmfq/api/projects/add_project', {
                customer_id: $scope.customerId,
                advance_payment: $scope.$parent.project.advance_payment,
                by_stages: $scope.$parent.project.by_stages,
                counselor: $scope.$parent.project.counselor,
                description: $scope.$parent.project.description,
                detail: $scope.$parent.project.detail,
                hospital_location: $scope.$parent.project.hospital_location,
                hospital_name: $scope.$parent.project.hospital_name,
                per_payment: $scope.$parent.project.per_payment,
                project_kind: $scope.$parent.project.project_kind,
                repayment_date: Date.parse($scope.$parent.project.repayment_date) / 1000,
                stat: $scope.$parent.project.stat,
                url: $scope.$parent.project.url,
                price: $scope.$parent.project.price,
            }).then(function (res) {
                if (res.code == 0) {
                    $scope.initProjectData();
                } else {
                    $scope.$apply(function () {
                        toaster.pop('error', '操作失败', res.message);
                    })
                }
            }, function (error) {
                toaster.pop('error', '操作失败', error);
            })
        } else if ($scope.$parent.isCreateProject == false) {
            $.post('/html/mmfq/api/projects/update_project_info', {
                project_id: $scope.selectProjectId,
                customer_id: $scope.customerId,
                advance_payment: $scope.$parent.project.advance_payment,
                by_stages: $scope.$parent.project.by_stages,
                counselor: $scope.$parent.project.counselor,
                description: $scope.$parent.project.description,
                detail: $scope.$parent.project.detail,
                hospital_location: $scope.$parent.project.hospital_location,
                hospital_name: $scope.$parent.project.hospital_name,
                per_payment: $scope.$parent.project.per_payment,
                project_kind: $scope.$parent.project.project_kind,
                repayment_date: Date.parse($scope.$parent.project.repayment_date) / 1000,
                stat: $scope.$parent.project.stat,
                url: $scope.$parent.project.url,
                price: $scope.$parent.project.price
            }).then(function (res) {
                if (res.code == 0) {
                    $scope.$apply(function () {
                        toaster.pop('success', '修改成功', '');
                    });
                    $scope.initProjectData();
                } else {
                    $scope.$apply(function () {
                        toaster.pop('error', '操作失败', res.message);
                    });
                }
            }, function (error) {
                toaster.pop('error', '操作失败', error);
            })
        }

    };

    $scope.$parent.showProject = function (x) {
        $scope.$parent.isCreateProject = false;
        angular.forEach($scope.$parent.projects, function (each) {
            if (each == x) {
                each.isSelect = true;
                $scope.selectProjectId = each.id;
            } else {
                each.isSelect = false
            }
        });
        x.isSelect = true;
        $scope.$parent.project = {
            customer_id: $scope.customerId,
            advance_payment: Number(x.advance_payment),
            by_stages: Number(x.by_stages),
            counselor: x.counselor,
            description: x.description,
            detail: x.detail,
            hospital_location: x.hospital_location,
            hospital_name: x.hospital_name,
            per_payment: Number(x.per_payment),
            project_kind: x.project_kind,
            repayment_date: x.repayment_date,
            stat: x.stat,
            url: x.url,
            price: x.price
        };
    };

    $scope.$parent.addProject = function () {
        $scope.$parent.project = {};
        $scope.$parent.isCreateProject = true
    };

    $scope.$parent.deleteProject = function (x) {
        $.post('/html/mmfq/api/projects/delete_project', {
            project_id: x.id
        }).then(function (res) {
            if (res.code == 0) {
                $scope.initProjectData();
            } else {
                $scope.$apply(function () {
                    toaster.pop('error', '操作失败', res.message);
                })
            }
        }, function (error) {
            $scope.$apply(function () {
                toaster.pop('error', '操作失败', error);
            })
        });
    };

    $scope.$root.projectStatusEquals = function (expected, actual) {
        if (actual == '') {
            return true;
        } else {
            return expected == actual;
        }
    };
    
    //第三板块
    $scope.initVisitData = function () {
        $.get('/html/mmfq/api/return_visit_records/get_return_visit_records', {
            customer_id: $scope.customerId
        }).then(function (res) {
            if (res.code == 0) {
                $scope.$apply(function () {
                    $scope.$parent.visitList = res.data;
                    console.log($scope.$parent.visitList);
                })
            } else {
                $scope.$apply(function () {
                    toaster.pop('error', '获取回访记录失败', res.message);
                })
            }
        }, function (error) {
            $scope.$apply(function () {
                toaster.pop('error', '获取回访记录失败', error);
            })
        });
    };
    $scope.initVisitData();

    $scope.$parent.addVisit = function () {
        console.log($scope);
        $scope.$parent.getDateTime($scope.$parent.visitCreateDate, $scope.$parent.visitCreateTime);
        console.log($scope.$parent.visitCreateDate);
        $.post('/html/mmfq/api/return_visit_records/add_return_visit_record', {
            customer_id: $scope.customerId,
            return_date: (Date.parse($scope.$parent.visitCreateDate) / 1000),
            comments: $scope.$parent.visitComments
        }).then(function (res) {
            if (res.code == 0) {
                $scope.initVisitData();
                $scope.$parent.visitDate = null;
            } else {
                $scope.$apply(function () {
                    toaster.pop('error', '操作失败', res.message);
                })
            }
        }, function (error) {
            $scope.$apply(function () {
                toaster.pop('error', '操作失败', error);
            })
        })
    };

    $scope.$parent.getDateTime = function (date, time) {
        date.setHours(time.getHours());
        date.setMinutes(time.getMinutes());
    };

    $scope.$parent.updateVisit = function (x) {
        $.post('/html/mmfq/api/return_visit_records/update_return_visit_record', {
            return_visit_record_id: x.id,
            detail: x.detail
        }).then(function (res) {
            if (res.code == 0) {
                $scope.$apply(function () {
                    toaster.pop('success', '修改成功', '');
                });
                $scope.initVisitData();
            } else {
                $scope.$apply(function () {
                    toaster.pop('error', '操作失败', res.message);
                })
            }
        }, function (error) {
            $scope.$apply(function () {
                toaster.pop('error', '操作失败', error);
            })
        })
    };

    $scope.$parent.deleteVisit = function (x) {
        $.post('/html/mmfq/api/return_visit_records/delete_return_visit_record', {
            return_visit_record_id: x.id
        }).then(function (res) {
            if (res.code == 0) {
                $scope.initVisitData();
            } else {
                $scope.$apply(function () {
                    toaster.pop('error', '操作失败', res.message);
                })
            }
        }, function (error) {
            $scope.$apply(function () {
                toaster.pop('error', '操作失败', error);
            })
        })
    };


    //第四板块
    $scope.$parent.intention = {};
    $scope.$parent.isCreateIntention = true;

    $.get('/html/mmfq/api/intention_kinds/get_intention_kinds').then(function (res) {
        if (res.code == 0) {
            $scope.$apply(function () {
                $scope.$parent.intentionKinds = res.data;
            })
        } else {
            $scope.$apply(function () {
                toaster.pop('error', '获取意向分类失败', res.message);
            })
        }
    }, function (error) {
        $scope.$apply(function () {
            toaster.pop('error', '获取意向分类失败', error);
        })
    });


    $scope.initIntentionData = function () {
        $.get('/html/mmfq/api/intentions/get_intentions', {
            customer_id: $scope.customerId
        }).then(function (res) {
            if (res.code == 0) {
                $scope.$apply(function () {
                    $scope.$parent.intentions = res.data;
                    console.log($scope.$parent.intentions);
                })
            } else {
                $scope.$apply(function () {
                    toaster.pop('error', '获取意向失败', res.message);
                })
            }
        }, function (error) {
            $scope.$apply(function () {
                toaster.pop('error', '获取意向失败', error);
            })
        });
    };

    $scope.initIntentionData();

    $scope.$parent.changeIntention = function () {
        if ($scope.$parent.isCreateIntention == true) {
            $.post('/html/mmfq/api/intentions/add_intention', {
                customer_id: $scope.customerId,
                label: $scope.$parent.intention.label,
                description: $scope.$parent.intention.description
            }).then(function (res) {
                if (res.code == 0) {
                    $scope.initIntentionData();
                } else {
                    $scope.$apply(function () {
                        toaster.pop('error', '操作失败', res.message);
                    })
                }
            }, function (error) {
                toaster.pop('error', '操作失败', error);
            })
        } else if ($scope.$parent.isCreateIntention == false) {
            $.post('/html/mmfq/api/intentions/update_intention', {
                intention_id: $scope.selectIntentionId,
                customer_id: $scope.customerId,
                label: $scope.$parent.intention.label,
                description: $scope.$parent.intention.description
            }).then(function (res) {
                if (res.code == 0) {
                    $scope.$apply(function () {
                        toaster.pop('success', '修改成功', '');
                    });
                    $scope.initIntentionData();
                } else {
                    $scope.$apply(function () {
                        toaster.pop('error', '操作失败', res.message);
                    });
                }
            }, function (error) {
                toaster.pop('error', '操作失败', error);
            })
        }

    };

    $scope.$parent.showIntention = function (x) {
        $scope.$parent.isCreateIntention = false;
        angular.forEach($scope.$parent.intentions, function (each) {
            if (each == x) {
                each.isSelect = true;
                $scope.selectIntentionId = each.id;
            } else {
                each.isSelect = false
            }
        });
        x.isSelect = true;
        $scope.$parent.intention = {
            customer_id: $scope.customerId,
            label: x.label,
            description: x.description
        };
    };

    $scope.$parent.addIntention = function () {
        $scope.$parent.project = {};
        $scope.$parent.isCreateIntention = true
    };

    $scope.$parent.deleteIntention = function (x) {
        $.post('/html/mmfq/api/intentions/delete_intention', {
            intention_id: x.id
        }).then(function (res) {
            if (res.code == 0) {
                $scope.initIntentionData();
            } else {
                $scope.$apply(function () {
                    toaster.pop('error', '操作失败', res.message);
                })
            }
        }, function (error) {
            $scope.$apply(function () {
                toaster.pop('error', '操作失败', error);
            })
        });
    };

}]);