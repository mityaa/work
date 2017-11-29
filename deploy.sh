#!/bin/bash

if [ -n "$CI_BUILD_REF_NAME" ]
then
	if [ "$CI_BUILD_REF_NAME" == "dev" ]
	then
		export DIR=/apitests/dev
		echo "dev branch deploing to" $DIR
		rm -r $DIR/*
		touch $DIR/.lock
		cp -r -f ./* $DIR
		rm -f $DIR/.lock
		exit
	fi
	if [ "$CI_BUILD_REF_NAME" == "master" ]
	then
		export DIR=/apitests/master
		echo "master branch deploing to" $DIR
		rm -r $DIR/*
		touch $DIR/.lock
		cp -r -f ./* $DIR
		rm -f $DIR/.lock
		exit
	fi
	if [ "$CI_BUILD_REF_NAME" == "release" ]
	then
		export DIR=/apitests/release
		echo "release branch deploing to" $DIR
		rm -r $DIR/*
		touch $DIR/.lock
		cp -r -f ./* $DIR
		rm -f $DIR/.lock
		exit
	fi
	if [ "$CI_BUILD_REF_NAME" != "release" ] && [ "$CI_BUILD_REF_NAME" != "master" ] && [ "$CI_BUILD_REF_NAME" != "dev" ]
	then
		echo "unknown branch was pushed" $CI_BUILD_REF_NAME
		exit
	fi
else
	echo -e "CI_BUILD_REF_NAME not set\n"
fi
