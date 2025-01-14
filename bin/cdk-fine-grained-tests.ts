#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkFineGrainedTestsStack } from '../lib/cdk-fine-grained-tests-stack';

const app = new cdk.App();
new CdkFineGrainedTestsStack(app, 'CdkFineGrainedTestsStack', {});