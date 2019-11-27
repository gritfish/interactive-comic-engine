import 'angular';
import {ngSanitize} from 'angular-sanitize';
import { BookController } from './components/book/book.controller.js';

var myApp = angular.module('myApp',['ngSanitize'])
.controller('BookController', BookController)