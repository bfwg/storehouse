//
//  Teacher.m
//  OCHelloWorld
//
//  Created by Fan Jin on 2015-08-23.
//  Copyright (c) 2015 Fan Jin. All rights reserved.
//

#import "Teacher.h"

@implementation Teacher

-(instancetype)init {
    
    self = [super init];
    
    if (self) {

        self._height = 1.2;
        _salary = 3.3;
    }
    
    return self;

}



- (NSString *) description {
    
    // 注意：_name这里的参数，一定不能换成self，会造成循环调用
    return [NSString stringWithFormat:@"姓名：%@ 年龄：%ld 身高：%.2f 工资：%ld", self._name, _age, self._height, _salary];
}

- (void) whoami {
    NSLog(@"I am a Teacher");
}

- (void)ring
{
    NSLog(@"下班了!");
}

@end
