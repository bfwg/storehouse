//
//  Student.m
//  OCHelloWorld
//
//  Created by Fan Jin on 2015-08-23.
//  Copyright (c) 2015 Fan Jin. All rights reserved.
//

#import "Student.h"

@implementation Student

- (instancetype)init
{
    self = [super init];
    if (self) {
        _which = self;
        // 第一步,添加通知
    }
    return self;
}


- (void)ring
{
    NSLog(@"放学了!");
}

- (void)watchTeacherPositionChanged
{
    // 注册
    // 1:观察者
    // 2:路径
    // 3:选项
    // 4:一般写 nil 或者 NULL
    [self addObserver:self
           forKeyPath:@"teacher.position"
              options:NSKeyValueObservingOptionNew | NSKeyValueObservingOptionOld
              context:@"position"];
    
}

// 当老师的位置发生改变时,自动调用该方法
- (void)observeValueForKeyPath:(NSString *)keyPath ofObject:(id)object change:(NSDictionary *)change context:(void *)context
{
    // 从change这个字典中获取相应的值
    
    if ([keyPath isEqualToString:@"teacher.position"]) {
        NSValue * point = change[@"new"];
        CGPoint newPoint = [point pointValue];
        if (newPoint.x == self.position.x && newPoint.y == self.position.y) {
            NSLog(@"%@说:老师来了，快点关QQ", self._name);
        } else {
            NSLog(@"%@说:诶，老师走了，继续！", self._name);
        }
    }
    
}

@end
